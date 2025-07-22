import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { MdArrowUpward } from 'react-icons/md'

import { PhotoData } from 'src/types'
import { getFileNameWithoutFileEnding } from 'src/firebase/utils'

import { MainNavBar } from '@components/NavBar/MainNavBar'
import { SiteHeading } from '@components/SiteHeading/SiteHeading'
import { FullscreenOverlay } from '@components/PhotoFrames/FullscreenOverlay/FullscreenOverlay'
import { ProgressiveImage } from '@components/PhotoFrames/ProgressiveImage'
import { IconButton } from '@components/Buttons/IconButton'
import { StoryFrame } from '@components/PhotoFrames/StoryFrame'

import {
    getPhotosInAlbum,
    useAlbumsList,
} from '../../firebase/firebase-firestore'

import './photographypages-styles.css'

export const DisplayPhotosPage = () => {
    const headingRef = useRef<HTMLDivElement>(null)
    const params = useParams()
    const [photos, setPhotos] = useState<PhotoData[]>([])
    const [gridStyle] = useState<number>(1)
    const [photoLayout, setPhotoLayout] = useState<string[]>([])
    const [currentFullscreenIndex, setCurrentFullscreenIndex] = useState<
        number | null
    >(null)
    const currentAlbum = useAlbumsList().find(
        (album) => album.name.toLowerCase() === params.albumName?.toLowerCase(),
    )

    const albumName = params.albumName?.toLowerCase()
    const photoName = params.photo?.toLowerCase()

    useEffect(() => {
        const getPhotosForCurrentPage = async () => {
            const photoData = await getPhotosInAlbum(albumName)
            setPhotos(photoData ?? [])
        }
        getPhotosForCurrentPage()
    }, [albumName])

    const sortedPhotos = useMemo(
        () =>
            currentAlbum?.sort === 'custom'
                ? photos.sort(
                      (photoA, photoB) => photoA.priority - photoB.priority,
                  )
                : photos,
        [photos, currentAlbum?.sort],
    )
    useEffect(() => {
        if (photoName) {
            const photoIndex = photos?.findIndex((photo) => {
                const fileName = getFileNameWithoutFileEnding(photo.fileName)
                return fileName === photoName
            })
            if (photoIndex >= 0) setCurrentFullscreenIndex(photoIndex)
        }
    }, [photos])

    function toggleFullscreen() {}

    const photoGrid1 = useMemo(() => {
        const layoutArray: string[] = []
        let counter = 0
        while (counter < sortedPhotos?.length) {
            if (counter === sortedPhotos?.length - 1) {
                layoutArray.push('full-width')
                counter++
                continue
            }
            if (sortedPhotos[counter].metaData?.orientation === 'landscape') {
                layoutArray.push('full-width')
                counter++
                continue
            }
            if (
                sortedPhotos[counter].metaData?.orientation === 'portrait' &&
                sortedPhotos[counter + 1].metaData?.orientation ===
                    'portrait' &&
                sortedPhotos[counter].displayMode !== 'story' &&
                sortedPhotos[counter + 1].displayMode !== 'story'
            ) {
                layoutArray.push('half-left', 'half-right')
                counter += 2
                continue
            }
            if (sortedPhotos[counter].metaData?.orientation === 'portrait') {
                layoutArray.push('narrow-width')
                counter++
                continue
            }
            layoutArray.push('default')
            counter++
        }
        return { layoutArray }
    }, [sortedPhotos])

    const photoGrid2 = useMemo(() => {
        const layoutArray: string[] = []
        let counter = 0
        while (counter < photos?.length) {
            if (counter === photos?.length - 1) {
                layoutArray.push('full-width')
                counter++
                continue
            }
            if (photos[counter].metaData?.orientation === 'landscape') {
                layoutArray.push('full-width')
                counter++
                continue
            }
            if (photos[counter].metaData?.orientation === 'portrait') {
                layoutArray.push('narrow-width')
                counter++
                continue
            }
            layoutArray.push('default')
            counter++
        }
        return { layoutArray }
    }, [photos])

    useEffect(() => {
        switch (gridStyle) {
            case 1:
                setPhotoLayout(photoGrid1.layoutArray)
                break
            case 2:
                setPhotoLayout(photoGrid2.layoutArray)
                break
            default:
                setPhotoLayout(photoGrid1.layoutArray)
        }
    }, [gridStyle, photoGrid1, photoGrid2])

    const displayedAlbumName = () => {
        if (!albumName) return 'feil  🥶'
        const nameWithoutUnderscore = albumName.replace('_', ' ')
        const newNameCapitalized =
            nameWithoutUnderscore.charAt(0).toUpperCase() +
            nameWithoutUnderscore.slice(1)
        return newNameCapitalized
    }

    return (
        <div className="main-grid displayed-photos-page">
            <MainNavBar hideNavbar={currentFullscreenIndex !== null} />
            <SiteHeading
                siteName={displayedAlbumName()}
                headingRef={headingRef}
            />
            <div className="divider-box" />
            <FullscreenOverlay
                photoUrls={photos.map((photo) => ({
                    photo: photo.imageUrl,
                    placeholder: photo.thumbnailUrl,
                }))}
                currentIndex={currentFullscreenIndex}
                onIndexChange={setCurrentFullscreenIndex}
            />
            {sortedPhotos?.map((photo, index) =>
                photo.displayMode === 'story' ? (
                    <StoryFrame
                        photo={photo}
                        focusable={currentFullscreenIndex === null}
                        onClick={() => setCurrentFullscreenIndex(index)}
                        // className={`photo-element photo-element--${photoLayout[index]} photo-element--${photo.metaData?.orientation}`}
                        key={photo.imageUrl}
                    />
                ) : (
                    <ProgressiveImage
                        src={photo.imageUrl}
                        placeholderSrc={photo.thumbnailUrl}
                        focusable={currentFullscreenIndex === null}
                        onClick={() => setCurrentFullscreenIndex(index)}
                        className={`photo-element photo-element--${photoLayout[index]} photo-element--${photo.metaData?.orientation}`}
                        key={photo.imageUrl}
                    />
                ),
            )}
            <IconButton
                className="scroll-to-top-button"
                onClick={() => headingRef.current?.scrollIntoView(true)}
            >
                <MdArrowUpward />
            </IconButton>
        </div>
    )
}

export default DisplayPhotosPage
