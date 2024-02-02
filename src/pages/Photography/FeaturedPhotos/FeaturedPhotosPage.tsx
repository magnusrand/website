import React, { useEffect, useRef, useState } from 'react'

import classNames from 'classnames'

import { SiteHeading } from '../../../components/SiteHeading/SiteHeading'
import { getPhotosInAlbum } from '../../../firebase/firebase-firestore'
import { PhotoData } from '../../../types'
import MainNavBar from '../../../components/NavBar/MainNavBar'
import { SimpleWithFrame } from '../../../components/PhotoFrames/SimpleWithFrame'

import Arrows from '../../../assets/images/arrows.svg'

import './featuredPhotos.css'

export const FeaturedPhotosPage = () => {
    const gridRef = useRef<HTMLDivElement>(null)
    const [photos, setPhotos] = useState<PhotoData[]>([])

    const ALBUM_NAME = 'featured'
    const PAGE_TITLE = 'Utvalgte'

    useEffect(() => {
        const getPhotosForCurrentPage = async () => {
            const photoData = await getPhotosInAlbum(ALBUM_NAME)
            setPhotos(photoData ?? [])
        }
        getPhotosForCurrentPage()
    }, [ALBUM_NAME])

    return (
        <div ref={gridRef} className="main-grid featured-photos-page">
            <MainNavBar />
            <SiteHeading siteName={PAGE_TITLE} />
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
            {photos.map((photo) => (
                <SimpleWithFrame photo={photo} key={photo.fileName} />
            ))}
        </div>
    )
}

export default FeaturedPhotosPage
