import React, { useEffect, useState } from 'react'

import { getPhotosInAlbum } from '@firebase-utils/firebase-firestore'
import { MdMailOutline } from 'react-icons/md'

import { PhotoData } from 'src/types'

import { SiteHeading } from '@components/SiteHeading/SiteHeading'
import { ShopFrame } from '@components/PhotoFrames/ShopFrame'
import { ButtonLink } from '@components/Buttons/ButtonLink'

import './printShop.css'

export function PrintShop(props: {}) {
    const [photos, setPhotos] = useState<PhotoData[]>([])

    useEffect(function getPrints() {
        async function fetchPrintPhotos() {
            const result = await getPhotosInAlbum('prints')
            if (result) setPhotos(result)
        }
        fetchPrintPhotos()
    }, [])

    return (
        <div className="print-shop main-grid">
            <SiteHeading siteName="Butikk" />
            {photos?.map((photo) => (
                <ShopFrame
                    photo={photo}
                    className="print-shop__section"
                    key={photo.documentRef.id}
                />
            ))}
            {photos.length > 0 && <OtherPhotoTextSection />}
        </div>
    )
}

function OtherPhotoTextSection({}) {
    return (
        <div className="print-shop__other-photo-section">
            <p>
                Er det et annet fotografi på nettsiden du ønsker, eller vil du
                ha hjelp til å finne et passende foto? Ta kontakt på e-post så,
                ordner vi bildet som passer deg best!
            </p>
            <ButtonLink
                variant="secondary"
                href="mailto:magnus.rand+fotobutikk@gmail.com?subject=Kj%C3%B8pe%20trykk%20av%20fotografi"
            >
                Send e-post
            </ButtonLink>
            <a href="mailto:magnus.rand+fotobutikk@gmail.com">
                <MdMailOutline /> magnus.rand+fotobutikk@gmail.com
            </a>
        </div>
    )
}
