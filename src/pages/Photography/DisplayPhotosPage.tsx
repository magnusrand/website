import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

// import { wrapGrid } from 'animate-css-grid'
import classNames from 'classnames'

import { SiteHeading } from '../../components/SiteHeading'
import { TextDivider } from '../../components/TextDivider'
import { getPhotosInAlbum } from '../../firebase/firebase-firestore'
import { PhotoData } from '../../types'
import MainNavBar from '../../components/NavBar/MainNavBar'

import './photographypages-styles.css'

export const DisplayPhotosPage = () => {
    const gridRef = useRef<HTMLDivElement>(null)
    const params = useParams()
    const [photos, setPhotos] = useState<PhotoData[]>([])
    const [gridStyle] = useState<number>(1)
    const [photoLayout, setPhotoLayout] = useState<number[]>([])
    const [currentFullscreen, setCurrentFullscreen] = useState('')

    const albumName = params.albumName?.toLowerCase()

    /** PhotoGrid experimental
    useLayoutEffect(() => {
        if (gridRef.current)
            wrapGrid(gridRef.current, {
                easing: 'easeInOut',
                stagger: 10,
                duration: 400,
            })
    }, [gridRef])

    const handleChangePhotoGrid = () => {
        console.log('change photo grid')
        setGridStyle((gridStyle % 2) + 1)
    }

    const photoGrid2 = (__photoLinks: PhotoData[]) => {
        const layoutArray = []
        let counter = 0
        while (counter < __photoLinks?.length) {
            if (counter + 1 === __photoLinks?.length) {
                layoutArray.push(1)
                counter++
            } else {
                layoutArray.push(2, 3)
                counter += 2
            }
        }
        return layoutArray
    }*/

    useEffect(() => {
        const getPhotosForCurrentPage = async () => {
            console.log('get photos for current page')
            const photoData = await getPhotosInAlbum(albumName)
            setPhotos(photoData ?? [])
        }
        getPhotosForCurrentPage()
    }, [albumName])

    const photoGrid1 = useMemo(() => {
        const layoutArray = []
        const dividerArray = new Array(photos.length)
            .fill(1)
            .map(() => (Math.random() >= 0.8 ? 1 : 0))
        let counter = 0
        while (counter < photos?.length) {
            if (counter + 1 === photos?.length) {
                layoutArray.push(1)
                counter++
            } else if (photos[counter].metaData?.orientation === 'landscape') {
                layoutArray.push(1)
                counter++
            } else if (
                photos[counter + 1].metaData?.orientation === 'portrait'
            ) {
                if (dividerArray[counter] === 1)
                    dividerArray.splice(counter, 1, 0)
                layoutArray.push(2, 3)
                counter += 2
            } else {
                layoutArray.push(11)
                counter++
            }
        }
        return { layoutArray, dividerArray }
    }, [photos])

    useEffect(() => {
        switch (gridStyle) {
            case 1:
                setPhotoLayout(photoGrid1.layoutArray)
                break
            // case 2:
            //     setPhotoLayout(photoGrid2(photoLinks))
            //     break
            default:
                setPhotoLayout(photoGrid1.layoutArray)
        }
    }, [photos, gridStyle, photoGrid1])

    const handleClickImage = (imageId: string) => {
        if (imageId !== '') {
            setCurrentFullscreen(imageId)
            document.body.style.overflow = 'hidden' // remove scrolling
        } else {
            setCurrentFullscreen('')
            document.body.style.overflow = 'visible' // activate scrolling}
        }
    }

    const displayedAlbumName = () => {
        if (!albumName) return 'feil  🥶'
        const nameWithoutUnderscore = albumName.replace('_', ' ')
        const newNameCapitalized =
            nameWithoutUnderscore.charAt(0).toUpperCase() +
            nameWithoutUnderscore.slice(1)
        return newNameCapitalized
    }

    return (
        <div ref={gridRef} className="main-grid displayed-photos-page">
            <MainNavBar />
            <SiteHeading siteName={displayedAlbumName()} />
            <div className="divider-box" />
            {photos?.map((photo, index) => (
                <React.Fragment key={photo.imageUrl}>
                    <div
                        className={`photo-element photo-element--${
                            photoLayout[index]
                        } test ${
                            currentFullscreen === photo.imageUrl
                                ? 'photo-element--active'
                                : ''
                        }`}
                        style={{
                            backgroundImage: `url('${photo.imageUrl}')`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        <img
                            className="photo-element__image"
                            src={photo.imageUrl}
                            tabIndex={currentFullscreen ? -1 : 0}
                            onClick={() => handleClickImage(photo.imageUrl)}
                        />
                    </div>
                    <div
                        className={classNames('fullscreen__overlay', {
                            'fullscreen__overlay--active':
                                currentFullscreen === photo.imageUrl,
                        })}
                        onClick={() => handleClickImage('')}
                    >
                        <img
                            className="photo-element__image__fullscreen"
                            src={photo.imageUrl}
                            tabIndex={currentFullscreen ? 0 : -1}
                        />
                    </div>
                    {photoGrid1.dividerArray[index] === 1 && (
                        <TextDivider
                            index={index}
                            text={displayedAlbumName()}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}

export default DisplayPhotosPage
