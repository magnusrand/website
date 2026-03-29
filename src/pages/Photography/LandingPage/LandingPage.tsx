import React, { useEffect, useState } from 'react'

import { getPhotoForPhotographyLandingPage } from '@firebase-utils/firebase-firestore'
import { PhotoData } from 'src/types'

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
        </div>
    )
}
