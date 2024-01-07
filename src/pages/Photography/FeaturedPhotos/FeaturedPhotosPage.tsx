import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import classNames from 'classnames'

import { HomeLogo } from '../../../components/NavBar/HomeLogo'
import { SiteHeading } from '../../../components/SiteHeading'
import { getPhotosInAlbum } from '../../../firebase/firebase-firestore'
import { PhotoData } from '../../../types'
import MainNavBar from '../../../components/NavBar/MainNavBar'

import './featuredPhotos.css'

export const DisplayPhotosPage = () => {
    const gridRef = useRef<HTMLDivElement>(null)
    const params = useParams()
    const [photos, setPhotos] = useState<PhotoData[]>([])
    const [gridStyle] = useState<number>(1)
    const [photoLayout, setPhotoLayout] = useState<number[]>([])
    const [currentFullscreen, setCurrentFullscreen] = useState('')

    const ALBUM_NAME = 'featured'

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
            <SiteHeading siteName={ALBUM_NAME} />
            <div className="divider-box" />
            {photos.map((photo) => (
                <div
                    key={photo.fileName}
                    className={classNames(
                        'featured-photos-page__photo-wrapper',
                    )}
                >
                    <div className="featured-photos-page__photo-wrapper__image-frame">
                        <img
                            className="featured-photos-page__photo-wrapper__image"
                            src={photo.imageUrl}
                            alt={photo.fileName}
                        />
                    </div>
                    <div className="featured-photos-page__photo-wrapper__caption">
                        {photo.title ? (
                            <span className="featured-photos-page__photo-wrapper__caption__heading type-garamond-bold ">
                                {photo.title} –
                            </span>
                        ) : (
                            <></>
                        )}
                        {` ${photo.description ?? ''}`}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default DisplayPhotosPage
