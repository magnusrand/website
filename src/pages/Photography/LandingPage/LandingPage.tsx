import React, { useEffect, useState } from 'react'

import { getPhotoForPhotographyLandingPage } from '@firebase-utils/firebase-firestore'
import { ButtonLink } from '@components/Buttons/ButtonLink'
import { useWindowDimensions } from '@components/utils'
import { ProgressiveImage } from '@components/PhotoFrames/ProgressiveImage'
import { PhotoData } from 'src/types'
import { Filters } from './Filters'

import './landing-page.css'

export const LandingPage = () => {
    const [backgroundPhoto, setBackgroundPhoto] = useState<PhotoData>()
    const { width } = useWindowDimensions()
    const isDesktop = width > 800

    useEffect(
        function getBackgroundPhoto() {
            async function fetchPhoto() {
                const _photo = await getPhotoForPhotographyLandingPage(
                    isDesktop ? 'desktop' : 'mobile',
                )
                if (_photo) setBackgroundPhoto(_photo)
            }
            fetchPhoto()
        },
        [isDesktop],
    )
    return (
        <div className="photo-landing-page main-grid">
            <ProgressiveImage
                className="photo-landing-page__background-image"
                src={backgroundPhoto?.imageUrl}
                placeholderSrc={backgroundPhoto?.thumbnailUrl}
                alt=""
            />
            <div className="photo-landing-page__title__background"></div>
            <h1 className="photo-landing-page__title__text type-garamond-regular font-size-medium-large">
                Fotografi
            </h1>
            <ButtonLink
                to="/foto/utvalgte"
                className="photo-landing-page__link-button"
            >
                Utvalgte
            </ButtonLink>
            <ButtonLink
                to="/foto/album"
                className="photo-landing-page__link-button"
                style={{
                    '--button-color': 'var(--dark-color-1)',
                }}
            >
                Album
            </ButtonLink>
            <ButtonLink
                to="/foto/etiketter"
                className="photo-landing-page__link-button"
                style={{
                    '--button-color': 'var(--dark-color-1)',
                }}
            >
                Etiketter
            </ButtonLink>
            <Filters />
        </div>
    )
}
