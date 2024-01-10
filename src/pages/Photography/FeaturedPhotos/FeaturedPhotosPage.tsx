import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import classNames from 'classnames'

import { HomeLogo } from '../../../components/NavBar/HomeLogo'
import { SiteHeading } from '../../../components/SiteHeading'
import { getPhotosInAlbum } from '../../../firebase/firebase-firestore'
import { PhotoData } from '../../../types'
import MainNavBar from '../../../components/NavBar/MainNavBar'
import { SimpleWithFrame } from '../../../components/PhotoFrames/SimpleWithFrame'

import Arrows from '../../../assets/images/arrows.svg'

import './featuredPhotos.css'

export const DisplayPhotosPage = () => {
    const gridRef = useRef<HTMLDivElement>(null)
    const [photos, setPhotos] = useState<PhotoData[]>([])

    const ALBUM_NAME = 'featured'
    const PAGE_TITLE = 'Utvalgte'

    useEffect(() => {
        const getPhotosForCurrentPage = async () => {
            console.log('get photos for current page')
            const photoData = await getPhotosInAlbum(ALBUM_NAME)
            setPhotos(photoData ?? [])
            console.log(photoData.length, ' photos fetched')
        }
        getPhotosForCurrentPage()
    }, [ALBUM_NAME])

    return (
        <div ref={gridRef} className="main-grid featured-photos-page">
            <MainNavBar />
            <HomeLogo />
            <SiteHeading siteName={PAGE_TITLE} />
            <div
                className="featured-photos-page__scroll-indicator"
                onMouseUp={() => {
                    const firstPhoto = document.getElementsByClassName(
                        'featured-photos-page__photo-wrapper',
                    )?.[0]
                    if (firstPhoto) {
                        firstPhoto.scrollIntoView({ behavior: 'smooth' })
                    }
                }}
            >
                <p>Skroll ned</p>
                <Arrows />
            </div>
            {photos.map((photo) => (
                <SimpleWithFrame photo={photo} key={photo.fileName} />
            ))}
        </div>
    )
}

export default DisplayPhotosPage
