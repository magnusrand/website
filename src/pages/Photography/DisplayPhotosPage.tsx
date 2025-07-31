import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { MdArrowUpward } from 'react-icons/md'

import { PhotoData } from 'src/types'
import { getFilenameForUrl } from 'src/firebase/utils'

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
    const navigate = useNavigate()
    const headingRef = useRef<HTMLDivElement>(null)
    const params = useParams()
    const [photos, setPhotos] = useState<PhotoData[]>([])
    const currentAlbum = useAlbumsList().find(
        (album) => album.name.toLowerCase() === params.albumName?.toLowerCase(),
    )

    const albumName = params.albumName?.toLowerCase()
    const fullscreenPhotoName = params.photo?.toLowerCase()

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
        const getPhotosForCurrentPage = async () => {
            const photoData = await getPhotosInAlbum(albumName)
            setPhotos(photoData ?? [])
        }
        getPhotosForCurrentPage()
    }, [albumName])

    /** Hook to keep fullscreen image and page scroll in sync */
    useEffect(() => {
        if (fullscreenPhotoName && photos.length > 0) {
            const photoElementInGrid =
                document.getElementById(fullscreenPhotoName)
            setTimeout(() => {
                photoElementInGrid?.scrollIntoView({
                    block: 'center',
                })
            }, 100) // Delay to ensure the element is rendered
        }
    }, [photos, fullscreenPhotoName])

    const photoLayout = useMemo(() => {
        const _photoLayout: string[] = []
        let counter = 0
        while (counter < sortedPhotos?.length) {
            if (counter === sortedPhotos?.length - 1) {
                _photoLayout.push('full-width')
                counter++
                continue
            }
            if (sortedPhotos[counter].metaData?.orientation === 'landscape') {
                _photoLayout.push('full-width')
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
                _photoLayout.push('half-left', 'half-right')
                counter += 2
                continue
            }
            if (sortedPhotos[counter].metaData?.orientation === 'portrait') {
                _photoLayout.push('narrow-width')
                counter++
                continue
            }
            _photoLayout.push('default')
            counter++
        }
        return _photoLayout
    }, [sortedPhotos])

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
            <MainNavBar hideNavbar={fullscreenPhotoName !== undefined} />
            <SiteHeading
                siteName={displayedAlbumName()}
                headingRef={headingRef}
            />
            <div className="divider-box" />
            {sortedPhotos?.map((photo, index) =>
                photo.displayMode === 'story' ? (
                    <StoryFrame
                        photo={photo}
                        focusable={!fullscreenPhotoName}
                        onClick={() => {
                            const _photoName = getFilenameForUrl(photo.fileName)
                            navigate(`/foto/album/${albumName}/${_photoName}`)
                        }}
                        // className={`photo-element photo-element--${photoLayout[index]} photo-element--${photo.metaData?.orientation}`}
                        key={photo.imageUrl}
                    />
                ) : (
                    <ProgressiveImage
                        src={photo.imageUrl}
                        placeholderSrc={photo.thumbnailUrl}
                        focusable={!fullscreenPhotoName}
                        id={getFilenameForUrl(photo.fileName)}
                        onClick={() => {
                            const _photoName = getFilenameForUrl(photo.fileName)
                            navigate(`/foto/album/${albumName}/${_photoName}`)
                        }}
                        className={`photo-element photo-element--${photoLayout[index]} photo-element--${photo.metaData?.orientation}`}
                        key={photo.imageUrl}
                    />
                ),
            )}
            <IconButton
                className="scroll-to-top-button"
                onClick={() => headingRef.current?.scrollIntoView(true)}
                tabIndex={fullscreenPhotoName ? -1 : 0}
            >
                <MdArrowUpward />
            </IconButton>
            <FullscreenOverlay
                photoUrls={photos.map((photo) => ({
                    photo: photo.imageUrl,
                    placeholder: photo.thumbnailUrl,
                    photoName: getFilenameForUrl(photo.fileName),
                }))}
                currentPhoto={fullscreenPhotoName}
                onNavigate={(nextPhotoName) => {
                    if (nextPhotoName === null)
                        return navigate(`/foto/album/${albumName}`)

                    navigate(`/foto/album/${albumName}/${nextPhotoName}`)
                }}
            />
        </div>
    )
}

export default DisplayPhotosPage
