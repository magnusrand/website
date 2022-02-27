import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
// import { wrapGrid } from 'animate-css-grid'
import { TextDivider } from '../../components/TextDivider'
import { getPhotosInAlbum } from '../../firebase/firebase'
import { PhotoData } from '../../types'
import MainNavBar from '../MainNavBar'

export const SelectedPhotosPage = () => {
    const [photoLinks, setPhotoLinks] = useState<PhotoData[]>([])
    const [gridStyle, setGridStyle] = useState<number>(1)
    const [photoLayout, setPhotoLayout] = useState<number[]>([])
    const gridRef = useRef<HTMLDivElement>(null)

    // useLayoutEffect(() => {
    //     if (gridRef.current)
    //         wrapGrid(gridRef.current, {
    //             easing: 'easeInOut',
    //             stagger: 10,
    //             duration: 400,
    //         })
    // }, [gridRef])

    useEffect(() => {
        const getPhotosLink = async () => {
            const photoLinkData = await getPhotosInAlbum('utvalgte')
            setPhotoLinks(photoLinkData ?? [])
        }
        getPhotosLink()
    }, [])

    useEffect(() => {
        switch (gridStyle) {
            case 1:
                setPhotoLayout(photoGrid1(photoLinks))
                break
            case 2:
                setPhotoLayout(photoGrid2(photoLinks))
                break
            default:
                setPhotoLayout(photoGrid1(photoLinks))
        }
    }, [photoLinks, gridStyle])

    const photoGrid1 = (__photoLinks: PhotoData[]) => {
        const layoutArray = []
        let counter = 0
        while (counter < __photoLinks?.length) {
            if (counter + 1 === __photoLinks?.length) {
                layoutArray.push(1)
                counter++
            } else if (
                __photoLinks[counter].meta?.orientation === 'landscape'
            ) {
                layoutArray.push(1)
                counter++
            } else if (
                __photoLinks[counter + 1].meta?.orientation === 'portrait'
            ) {
                layoutArray.push(2, 3)
                counter += 2
            } else {
                layoutArray.push(11)
                counter++
            }
        }
        return layoutArray
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
    }

    // const handleChangePhotoGrid = () => {
    //     console.log('change photo grid')
    //     setGridStyle((gridStyle % 2) + 1)
    // }

    return (
        <div ref={gridRef} className="main-grid selected-photos-page">
            <MainNavBar />
            <div className="horizontal-bar-top" />
            <div className="horizontal-bar-top__text type-garamond-bold font-size-extralarge">
                Fotografi
            </div>
            <div className="horizontal-bar-bottom" />
            <div className="horizontal-bar-bottom__text type-garamond-regular font-size-extralarge">
                – utvalgte
            </div>
            <div className="divider-box" />
            {/* <button
                className="photo-element--1"
                onClick={handleChangePhotoGrid}
            >
                klikk
            </button> */}
            {photoLinks?.map((photo, index) => (
                <>
                    <div
                        key={index}
                        className={`photo-element photo-element--${photoLayout[index]} test`}
                        style={{
                            backgroundImage: `url(${photo.link + '=w1500'})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        <img
                            className="photo-element__image"
                            src={photo.link + '=w1500'}
                            style={{ visibility: 'hidden' }}
                        />
                    </div>
                    {[1, 11, 3].includes(photoLayout[index]) &&
                        Math.random() * 8 > 7 && (
                            <TextDivider index={index} text="Utvalgte" />
                        )}
                </>
            ))}
        </div>
    )
}

export default SelectedPhotosPage
