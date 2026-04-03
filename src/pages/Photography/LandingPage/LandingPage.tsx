import React, { useEffect, useState } from 'react'

import { getPhotoForPhotographyLandingPage } from '@firebase-utils/firebase-firestore'
import { ButtonLink } from '@components/Buttons/ButtonLink'
import { PhotoData } from 'src/types'
import { Filters } from './Filters'

import './landing-page.css'

export const LandingPage = () => {
    const [backgroundPhoto, setBackgroundPhoto] = useState<PhotoData>()
    useEffect(function getBackgroundPhoto() {
        async function fetchPhoto() {
            const _photo = await getPhotoForPhotographyLandingPage()
            if (_photo) setBackgroundPhoto(_photo)
        }
        fetchPhoto()
    }, [])
    return (
        <div className="photo-landing-page main-grid">
            <img
                className="photo-landing-page__background-image"
                src={backgroundPhoto?.imageUrl}
                alt=""
            />
            <div className="photo-landing-page__title__background"></div>
            <h1 className="photo-landing-page__title__text type-garamond-regular font-size-medium-large">
                Fotografi
            </h1>
            <ButtonLink
                to="/foto/utvalgte"
                style={{
                    '--button-color': 'var(--dark-color-1)',
                    gridColumn: '5',
                    gridRowStart: '3',
                    zIndex: '10',
                    width: 'fit-content',
                    alignSelf: 'start',
                }}
            >
                Utvalgte
            </ButtonLink>
            <ButtonLink
                to="/foto/album"
                style={{
                    '--button-color': 'var(--dark-color-1)',
                    gridColumn: '6',
                    gridRowStart: '3',
                    zIndex: '10',
                    width: 'fit-content',
                    alignSelf: 'center',
                    justifySelf: 'center',
                }}
            >
                Album
            </ButtonLink>
            <ButtonLink
                to="/foto/etiketter"
                style={{
                    '--button-color': 'var(--dark-color-1)',
                    gridColumn: '7',
                    gridRowStart: '3',
                    zIndex: '10',
                    width: 'fit-content',
                    alignSelf: 'end',
                }}
            >
                Etiketter
            </ButtonLink>
            <Filters />
        </div>
    )
}
