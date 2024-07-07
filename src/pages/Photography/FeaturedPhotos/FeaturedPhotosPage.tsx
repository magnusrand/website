import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import classNames from 'classnames'
import { MdArrowUpward } from 'react-icons/md'

import { SiteHeading } from '../../../components/SiteHeading/SiteHeading'
import { getPhotosInAlbum } from '../../../firebase/firebase-firestore'
import { PhotoData } from '../../../types'
import MainNavBar from '../../../components/NavBar/MainNavBar'
import { SimpleWithFrame } from '../../../components/PhotoFrames/SimpleWithFrame'
import { FullscreenOverlay } from '../../../components/PhotoFrames/FullscreenOverlay/FullscreenOverlay'
import { IconButton } from '../../../components/Buttons/IconButton'

import Arrows from '../../../assets/images/arrows.svg'

import './featuredPhotos.css'

export const FeaturedPhotosPage = () => {
    const headingRef = useRef<HTMLDivElement>(null)
    const [photos, setPhotos] = useState<PhotoData[]>([])
    const [currentFullscreenIndex, setCurrentFullscreenIndex] = useState<
        number | null
    >(null)
    const { hash } = useLocation()

    const ALBUM_NAME = 'featured'
    const PAGE_TITLE = 'Utvalgte'

    useEffect(() => {
        const getPhotosForCurrentPage = async () => {
            const photoData = await getPhotosInAlbum(ALBUM_NAME)
            setPhotos(photoData ?? [])
        }
        getPhotosForCurrentPage()
    }, [ALBUM_NAME])

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
                'fullscreen-active': currentFullscreenIndex !== null,
            })}
        >
            <MainNavBar />
            <SiteHeading siteName={PAGE_TITLE} headingRef={headingRef} />
            <FullscreenOverlay
                photoUrls={photos.map((photo) => photo.imageUrl)}
                currentIndex={currentFullscreenIndex}
                onIndexChange={setCurrentFullscreenIndex}
            />
            {photos.length > 0 && (
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
                            firstPhoto.scrollIntoView({ behavior: 'smooth' })
                        }
                    }}
                >
                    <p>Skroll ned</p>
                    <Arrows />
                </button>
            )}
            {photos.map((photo, index) => (
                <SimpleWithFrame
                    photo={photo}
                    key={photo.fileName}
                    onClick={() => setCurrentFullscreenIndex(index)}
                    focusable={currentFullscreenIndex === null}
                />
            ))}
            <IconButton
                className="scroll-to-top-button"
                onClick={() => headingRef.current?.scrollIntoView(true)}
            >
                <MdArrowUpward />
            </IconButton>
        </div>
    )
}

export default FeaturedPhotosPage
