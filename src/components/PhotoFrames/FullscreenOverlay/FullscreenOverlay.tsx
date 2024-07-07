import React, { useEffect } from 'react'

import classNames from 'classnames'
import { MdClose } from 'react-icons/md'

import { IconButton } from '../../Buttons/IconButton'

import './fullscreenOverlay.css'

export const FullscreenOverlay = ({
    photoUrls,
    currentIndex,
    onIndexChange,
}: {
    photoUrls: string[]
    currentIndex: number | null
    onIndexChange: (index: number | null) => void
}) => {
    useEffect(() => {
        if (currentIndex !== null) {
            document.body.style.overflow = 'hidden' // remove scrolling
        } else {
            document.body.style.overflow = 'visible' // activate scrolling
        }
    }, [currentIndex])

    useEffect(() => {
        if (currentIndex === null) return
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onIndexChange(null)
        }
        const handleArrowKeys = (e: KeyboardEvent) => {
            if (currentIndex === null) return
            if (e.key == 'ArrowRight') {
                if (currentIndex >= photoUrls.length - 1) return
                onIndexChange(currentIndex + 1)
            }
            if (e.key == 'ArrowLeft') {
                if (currentIndex <= 0) return
                onIndexChange(currentIndex - 1)
            }
        }

        addEventListener('keyup', handleEscape)
        addEventListener('keydown', handleArrowKeys)
        return () => {
            removeEventListener('keyup', handleEscape)
            removeEventListener('keydown', handleArrowKeys)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex])

    return (
        <div
            className={classNames('fullscreen-overlay', {
                'fullscreen-overlay--active': currentIndex !== null,
            })}
            onClick={() => onIndexChange(null)}
        >
            <IconButton
                className="fullscreen-overlay__close-button"
                onClick={() => onIndexChange(null)}
                tabIndex={currentIndex !== null ? 0 : -1}
            >
                <MdClose size="2rem" />
            </IconButton>
            <img
                className="fullscreen-overlay__image"
                src={currentIndex !== null ? photoUrls?.[currentIndex] : ''}
                tabIndex={currentIndex !== null ? 0 : -1}
            />
        </div>
    )
}
