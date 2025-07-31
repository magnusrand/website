import React, { useEffect } from 'react'

import classNames from 'classnames'
import { MdClose } from 'react-icons/md'

import { IconButton } from '../../Buttons/IconButton'
import { ProgressiveImage } from '../ProgressiveImage'

import './fullscreenOverlay.css'

export const FullscreenOverlay = ({
    photoUrls,
    currentPhoto,
    onNavigate,
}: {
    photoUrls: Array<{ photo: string; placeholder: string; photoName?: string }>
    currentPhoto?: string
    onNavigate: (action: string | null) => void
}) => {
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

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onNavigate(null)
            }
        }
        const handleArrowKeys = (e: KeyboardEvent) => {
            if (e.key == 'ArrowRight') {
                if (
                    currentPhotoData &&
                    currentPhotoIndex < photoUrls?.length - 1
                )
                    onNavigate(
                        photoUrls?.[currentPhotoIndex + 1].photoName ?? null,
                    )
            } else if (e.key == 'ArrowLeft') {
                if (currentPhotoData && currentPhotoIndex > 0)
                    onNavigate(
                        photoUrls?.[currentPhotoIndex - 1].photoName ?? null,
                    )
            }
        }

        addEventListener('keyup', handleEscape)
        addEventListener('keydown', handleArrowKeys)
        return () => {
            removeEventListener('keyup', handleEscape)
            removeEventListener('keydown', handleArrowKeys)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPhoto, currentPhotoData?.photoName, currentPhotoIndex])

    return (
        <div
            className={classNames('fullscreen-overlay', {
                'fullscreen-overlay--active': showFullscreen,
            })}
            onClick={() => onNavigate(null)}
        >
            <IconButton
                className="fullscreen-overlay__close-button"
                onClick={() => onNavigate(null)}
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
