import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import classNames from 'classnames'
import { MdArrowUpward } from 'react-icons/md'

import { PhotoData } from 'src/types'
import { getPhotosInAlbum } from 'src/firebase/firebase-firestore'
import { getFilenameForUrl } from 'src/firebase/utils'

import { SiteHeading } from '@components/SiteHeading/SiteHeading'

import { MainNavBar } from '@components/NavBar/MainNavBar'
import { SimpleFrame } from '@components/PhotoFrames/SimpleFrame'
import { StoryFrame } from '@components/PhotoFrames/StoryFrame'
import { FullscreenOverlay } from '@components/PhotoFrames/FullscreenOverlay/FullscreenOverlay'
import { IconButton } from '@components/Buttons/IconButton'

import Arrows from '../../../assets/images/arrows.svg'

import './featuredPhotos.css'

export const FeaturedPhotosPage = () => {
    const headingRef = useRef<HTMLDivElement>(null)
    const [photos, setPhotos] = useState<PhotoData[]>([])
    const { hash } = useLocation()
    const navigate = useNavigate()
    const params = useParams()

    const fullscreenPhotoName = params.photo?.toLowerCase()

    const ALBUM_NAME = 'featured'
    const PAGE_TITLE = 'Utvalgte'

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove('animation-exit')
                        entry.target.classList.add('animation-in')
                        return
                    }

                    entry.target.classList.remove('animation-in')
                    entry.target.classList.add('animation-exit')
                })
            },
            { rootMargin: '10% 0px 10% 0px' },
        )

        const images = document.querySelectorAll('.progressive-img')

        images.forEach((element) => observer.observe(element))
    }, [photos])

    useEffect(() => {
        const getPhotosForCurrentPage = async () => {
            const photoData = await getPhotosInAlbum(ALBUM_NAME)
            setPhotos(photoData ?? [])
        }
        getPhotosForCurrentPage()
    }, [ALBUM_NAME])

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

    const sortedPhotos = useMemo(
        () =>
            photos.sort((photoA, photoB) => photoA.priority - photoB.priority),
        [photos],
    )

    useEffect(() => {
        if (hash && photos.length > 0) {
            const sanitizedHash = location.hash.slice(1)
            const elementWithHashId = document.getElementById(sanitizedHash)

            if (sanitizedHash && elementWithHashId) {
                setTimeout(() => {
                    elementWithHashId.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    })
                }, 100)
            }
        }
    }, [hash, photos.length])

    return (
        <div
            className={classNames('main-grid featured-photos-page', {
                'fullscreen-active': fullscreenPhotoName !== null,
            })}
        >
            <SiteHeading siteName={PAGE_TITLE} headingRef={headingRef} />
            {sortedPhotos.length > 0 && (
                <button
                    className={classNames(
                        'featured-photos-page__scroll-indicator',
                        {
                            'featured-photos-page__scroll-indicator--show':
                                photos.length > 0,
                        },
                    )}
                    onClick={() => {
                        const firstPhoto =
                            document.getElementsByClassName('photo')?.[0]
                        if (firstPhoto) {
                            firstPhoto.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center',
                            })
                        }
                    }}
                >
                    <p>Skroll ned</p>
                    <Arrows />
                </button>
            )}
            {sortedPhotos.map((photo, index) => {
                switch (photo.displayMode) {
                    case 'story':
                        return (
                            <StoryFrame
                                id={getFilenameForUrl(photo.fileName)}
                                photo={photo}
                                key={photo.fileName}
                                onClick={() =>
                                    navigate(
                                        `/foto/utvalgte/${getFilenameForUrl(
                                            photo.fileName,
                                        )}`,
                                    )
                                }
                                focusable={fullscreenPhotoName === undefined}
                            />
                        )
                    default:
                        return (
                            <SimpleFrame
                                id={getFilenameForUrl(photo.fileName)}
                                photo={photo}
                                key={photo.fileName}
                                onClick={() =>
                                    navigate(
                                        `/foto/utvalgte/${getFilenameForUrl(
                                            photo.fileName,
                                        )}`,
                                    )
                                }
                                focusable={fullscreenPhotoName === undefined}
                            />
                        )
                }
            })}
            {sortedPhotos.length > 0 && (
                <IconButton
                    className="scroll-to-top-button"
                    onClick={() => headingRef.current?.scrollIntoView(true)}
                >
                    <MdArrowUpward />
                </IconButton>
            )}
            <FullscreenOverlay
                photoUrls={photos.map((photo) => ({
                    photo: photo.imageUrl,
                    placeholder: photo.thumbnailUrl,
                    photoName: getFilenameForUrl(photo.fileName),
                }))}
                currentPhoto={fullscreenPhotoName}
                onNavigate={(nextPhotoName) => {
                    if (nextPhotoName === null)
                        return navigate(`/foto/utvalgte`)

                    navigate(`/foto/utvalgte/${nextPhotoName}`)
                }}
            />
        </div>
    )
}
