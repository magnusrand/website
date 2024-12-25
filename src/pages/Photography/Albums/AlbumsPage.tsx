import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import MainNavBar from '../../../components/NavBar/MainNavBar'
import { ProgressiveImage } from '../../../components/PhotoFrames/ProgressiveImage'
import { getAlbums } from '../../../firebase/firebase-firestore'
import { AlbumData } from '../../../types'

import './albumsPage.css'

const AlbumsPage = () => {
    const [albums, setAlbums] = useState<AlbumData[]>([])
    useEffect(() => {
        const getPhotosForCurrentPage = async () => {
            const albumData = await getAlbums()
            setAlbums(albumData ?? [])
        }
        getPhotosForCurrentPage()
    }, [])

    const AlbumCard = (album?: AlbumData) => {
        if (album === undefined) return <></>
        const albumName = album.name === 'featured' ? 'Utvalgte' : album.name
        return (
            <Link
                to={`/foto/${albumName.toLowerCase()}`}
                key={album.name}
                className="albums-page__list__album-card"
            >
                <div className="albums-page__list__album-card__image-container">
                    <ProgressiveImage
                        src={album.coverPhotoUrl}
                        alt={albumName}
                        placeholderSrc={album.coverPhotoPlaceholderUrl}
                    />
                </div>
                <p className="albums-page__list__album-card__title type-garamond-regular ">
                    {albumName.toLowerCase().replace('-', ' ')}
                    <span className="albums-page__list__album-card__title__sub type-sourcesans-regular">
                        ({album.numberOfPhotos} bilder)
                    </span>
                </p>
            </Link>
        )
    }

    return (
        <div className="main-grid albums-page">
            <MainNavBar />
            <div className="albums-page__list-wrapper">
                {AlbumCard(albums.find((album) => album.name === 'featured'))}
                {albums
                    .filter(
                        (album) =>
                            album.name !== 'featured' &&
                            album.numberOfPhotos > 0,
                    )
                    .map((album) => AlbumCard(album))}
            </div>
        </div>
    )
}

export default AlbumsPage
