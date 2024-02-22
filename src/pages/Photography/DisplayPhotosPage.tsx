import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import MainNavBar from '../../components/NavBar/MainNavBar'
import { SiteHeading } from '../../components/SiteHeading/SiteHeading'
import { TextDivider } from '../../components/TextDivider/TextDivider'
import { FullscreenOverlay } from '../../components/PhotoFrames/FullscreenOverlay/FullscreenOverlay'
import { getPhotosInAlbum } from '../../firebase/firebase-firestore'
import { PhotoData } from '../../types'

import './photographypages-styles.css'

export const DisplayPhotosPage = () => {
    const gridRef = useRef<HTMLDivElement>(null)
    const params = useParams()
    const [photos, setPhotos] = useState<PhotoData[]>([])
    const [gridStyle] = useState<number>(1)
    const [photoLayout, setPhotoLayout] = useState<number[]>([])
    const [currentFullscreen, setCurrentFullscreen] = useState('')

    const albumName = params.albumName?.toLowerCase()

    useEffect(() => {
        const getPhotosForCurrentPage = async () => {
            const photoData = await getPhotosInAlbum(albumName)
            console.log('Got ', photoData.length, ' photos for current page')
            setPhotos(photoData ?? [])
        }
        getPhotosForCurrentPage()
    }, [albumName])

    const photoGrid1 = useMemo(() => {
        const layoutArray = []
        const dividerArray = new Array(photos.length).fill(0)
        // const dividerArray = new Array(photos.length).fill(0)
        // .map(() => (Math.random() >= 0.8 ? 1 : 0))
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
            <MainNavBar hideNavbar={currentFullscreen !== ''} />
            <SiteHeading siteName={displayedAlbumName()} />
            <div className="divider-box" />
            <FullscreenOverlay
                currentFullscreenSrc={currentFullscreen}
                onClick={() => setCurrentFullscreen('')}
            />
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
                            onClick={() => setCurrentFullscreen(photo.imageUrl)}
                        />
                    </div>
                    {photoGrid1.dividerArray[index] === 1 && (
                        <TextDivider text={displayedAlbumName()} />
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}

export default DisplayPhotosPage
