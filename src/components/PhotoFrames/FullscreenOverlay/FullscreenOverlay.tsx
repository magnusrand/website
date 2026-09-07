import React, { useEffect } from 'react'

import classNames from 'classnames'
import { MdClose } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'

import { useSyncScrollWithFullscreen } from '@components/utils'

import { IconButton } from '../../Buttons/IconButton'
import { ProgressiveImage } from '../ProgressiveImage'

import { PhotoData } from 'src/types'
import { getFilenameForUrl } from '@firebase-utils/utils'

import './fullscreenOverlay.css'

export const FullscreenOverlay = ({
    photos,
    currentPhoto: _currentPhoto,
    nextPhotoPath,
    dismissFullscreenPath,
}: {
    photos: PhotoData[]
    currentPhoto?: string
    nextPhotoPath: (nextPhotoName: string | null) => string
    dismissFullscreenPath: string
}) => {
    const navigate = useNavigate()

    const photoUrls = photos.map((photo) => ({
        photo: photo.imageUrl,
        placeholder: photo.thumbnailUrl,
        photoName: getFilenameForUrl(photo.fileName),
    }))

    const params = useParams()
    const currentPhoto = _currentPhoto ?? params.photo?.toLowerCase()

    const showFullscreen = currentPhoto !== undefined
    const currentPhotoIndex = photoUrls?.findIndex(
        (photo) => photo.photoName === currentPhoto,
    )
    const currentPhotoData =
        currentPhotoIndex !== -1 ? photoUrls?.[currentPhotoIndex] : null

    useEffect(() => {
        // stop scrolling
        if (showFullscreen) document.body.style.overflow = 'hidden'
        // activate scrolling
        else document.body.style.overflow = 'visible'
    }, [showFullscreen])

    useEffect(
        function handleFullscreenNavigation() {
            const dismissFullscreen = () => {
                navigate(dismissFullscreenPath, { replace: true })
            }

            const goToNextFullscreenPhoto = () => {
                const nextPhotoName =
                    photoUrls?.[currentPhotoIndex + 1].photoName
                if (
                    nextPhotoName &&
                    currentPhotoData &&
                    currentPhotoIndex < photoUrls?.length - 1
                )
                    navigate(nextPhotoPath(nextPhotoName), { replace: true })
            }

            const goToPrevFullscreenPhoto = () => {
                const prevPhotoName =
                    photoUrls?.[currentPhotoIndex - 1].photoName
                if (prevPhotoName && currentPhotoData && currentPhotoIndex > 0)
                    navigate(nextPhotoPath(prevPhotoName), { replace: true })
            }
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    dismissFullscreen()
                }
            }
            const handleArrowKeys = (e: KeyboardEvent) => {
                if (e.key == 'ArrowRight') {
                    goToNextFullscreenPhoto()
                } else if (e.key == 'ArrowLeft') {
                    goToPrevFullscreenPhoto()
                }
            }

            let touchStartX = 0
            let touchEndX = 0

            const handleTouchMove = (e: TouchEvent) => {
                e.preventDefault()
            }
            const handleTouchStart = (e: TouchEvent) => {
                touchStartX = e.changedTouches[0].pageX
            }
            const handleTouchEnd = (e: TouchEvent) => {
                touchEndX = e.changedTouches[0].pageX
                const touchDeltaX = touchEndX - touchStartX

                // Swipe towards right
                if (touchDeltaX > 100) {
                    goToNextFullscreenPhoto()
                }
                // Swipe towards left
                else if (touchDeltaX < -100) {
                    goToPrevFullscreenPhoto()
                }
            }

            addEventListener('touchstart', handleTouchStart)
            addEventListener('touchend', handleTouchEnd)
            addEventListener('touchmove', handleTouchMove)
            addEventListener('keyup', handleEscape)
            addEventListener('keydown', handleArrowKeys)
            return () => {
                removeEventListener('keyup', handleEscape)
                removeEventListener('keydown', handleArrowKeys)
                removeEventListener('touchstart', handleTouchStart)
                removeEventListener('touchend', handleTouchEnd)
                removeEventListener('touchmove', handleTouchMove)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [currentPhoto, currentPhotoData?.photoName, currentPhotoIndex],
    )

    useSyncScrollWithFullscreen(currentPhoto, photos)

    return (
        <div
            className={classNames('fullscreen-overlay', {
                'fullscreen-overlay--active': showFullscreen,
            })}
            onClick={() => navigate(dismissFullscreenPath)}
        >
            <IconButton
                className="fullscreen-overlay__close-button"
                onClick={() => navigate(dismissFullscreenPath)}
                tabIndex={currentPhoto ? 0 : -1}
            >
                <MdClose size="2rem" aria-label="Lukk fullskjermvisning" />
            </IconButton>
            {currentPhotoData && (
                <ProgressiveImage
                    className="fullscreen-overlay__image"
                    src={currentPhotoData?.photo}
                    placeholderSrc={currentPhotoData?.placeholder}
                    focusable={true}
                />
            )}
        </div>
    )
}
