import React, { useEffect } from 'react'

import classNames from 'classnames'
import { MdClose } from 'react-icons/md'

import { IconButton } from '../../Buttons/IconButton'

import './fullscreenOverlay.css'

export const FullscreenOverlay = ({
    currentFullscreenSrc,
    onClick,
}: {
    currentFullscreenSrc: string
    onClick: () => void
}) => {
    useEffect(() => {
        if (currentFullscreenSrc !== '') {
            document.body.style.overflow = 'hidden' // remove scrolling
        } else {
            document.body.style.overflow = 'visible' // activate scrolling
        }
    }, [currentFullscreenSrc])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClick()
        }

        addEventListener('keydown', (e) => handleEscape(e))
        return () => removeEventListener('keydown', (e) => handleEscape(e))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div
            className={classNames('fullscreen-overlay', {
                'fullscreen-overlay--active': currentFullscreenSrc !== '',
            })}
            onClick={onClick}
        >
            <IconButton
                className="fullscreen-overlay__close-button"
                onClick={onClick}
            >
                <MdClose color="white" size="2rem" />
            </IconButton>
            <img
                className="fullscreen-overlay__image"
                src={currentFullscreenSrc}
                tabIndex={currentFullscreenSrc ? 0 : -1}
            />
        </div>
    )
}
