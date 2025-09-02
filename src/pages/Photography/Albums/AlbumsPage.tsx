import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MdArrowBack } from 'react-icons/md'

import { AlbumData } from 'src/types'

import { MainNavBar } from '@components/NavBar/MainNavBar'
import { ProgressiveImage } from '@components/PhotoFrames/ProgressiveImage'
import { IconButton } from '@components/Buttons/IconButton'

import { getAlbums } from '../../../firebase/firebase-firestore'

import './albumsPage.css'

type AlbumCollections = Record<string, AlbumData[]>

export const AlbumsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const currentAlbumCollection = searchParams.get('samling')
    const [albums, setAlbums] = useState<AlbumData[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const runGetAlbums = async () => {
            setLoading(true)
            const albumData = await getAlbums({
                collectionName: currentAlbumCollection,
            })
            setAlbums(albumData ?? [])
            setLoading(false)
        }
        runGetAlbums()
    }, [currentAlbumCollection])

    const albumCollections = useMemo(
        () => {
            if (currentAlbumCollection) return []

            return albums
                .filter(
                    (album) =>
                        !['', undefined, null].includes(album.albumCollection),
                )
                .reduce((acc, album) => {
                    if (album.albumCollection in acc) {
                        acc[album.albumCollection].push(album)
                    } else {
                        acc[album.albumCollection] = [album]
                    }
                    return acc
                }, {} as AlbumCollections)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [albums],
    )

    return (
        <div className="main-grid albums-page">
            <div className="albums-page__list-wrapper">
                {!loading && (
                    <>
                        {currentAlbumCollection && (
                            <div className="album-page--collection__heading">
                                <IconButton
                                    as={Link}
                                    to="/foto/album"
                                    className="album-page--collection__heading__button"
                                >
                                    <MdArrowBack />
                                </IconButton>
                                <h1 className="album-page--collection__heading__title type-garamond-bold">
                                    {currentAlbumCollection
                                        .toUpperCase()
                                        .replace('-', ' ')}
                                </h1>
                            </div>
                        )}
                        <AlbumCard
                            album={albums.find(
                                (album) => album.name === 'featured',
                            )}
                            to="/foto/utvalgte"
                        />
                        {Object.entries(albumCollections).map(
                            ([_albumCollectionName, _albums]) => (
                                <AlbumCollectionCard
                                    key={_albumCollectionName}
                                    albumCollection={{
                                        [_albumCollectionName]: _albums,
                                    }}
                                    onClick={(albumCollectionName) =>
                                        setSearchParams(albumCollectionName)
                                    }
                                />
                            ),
                        )}
                        {albums
                            .filter(
                                (album) =>
                                    album.name !== 'featured' &&
                                    !Object.keys(albumCollections).includes(
                                        album.albumCollection,
                                    ) &&
                                    album.numberOfPhotos > 0,
                            )
                            .map((album) => (
                                <AlbumCard
                                    key={album.documentRef.id}
                                    album={album}
                                />
                            ))}
                    </>
                )}
            </div>
        </div>
    )
}

const AlbumCard = ({ album, to }: { album?: AlbumData; to?: string }) => {
    if (album === undefined) return <></>
    const albumName = album.name === 'featured' ? 'Utvalgte' : album.name
    return (
        <Link
            to={to ?? `/foto/album/${albumName.toLowerCase()}`}
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

const AlbumCollectionCard = ({
    albumCollection,
    onClick,
}: {
    albumCollection: AlbumCollections
    onClick: (albumCollectionName: string) => void
}) => {
    if (albumCollection === undefined) return <></>
    const albumCollectionName = Object.keys(albumCollection)[0]
    const albumsInCollection = albumCollection[albumCollectionName]

    return (
        <Link
            to={`/foto/album?samling=${albumCollectionName.toLowerCase()}`}
            onClick={() => onClick(albumCollectionName)}
            key={albumCollectionName}
            className="albums-page__list__album-card"
        >
            <div className="albums-page__list__album-card__image-container--collection">
                {albumsInCollection.slice(0, 6).map((album) => (
                    <ProgressiveImage
                        key={albumCollectionName + album.name}
                        src={album.coverPhotoUrl}
                        alt={album.name}
                        placeholderSrc={album.coverPhotoPlaceholderUrl}
                    />
                ))}
            </div>
            <p className="albums-page__list__album-card__title type-garamond-bold">
                {albumCollectionName.toLowerCase().replace('-', ' ')}
            </p>
        </Link>
    )
}
