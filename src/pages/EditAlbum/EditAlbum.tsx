import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import MainNavBar from '../../components/NavBar/MainNavBar'
import EditPhotoDataCard from '../../components/Admin/EditPhotoDataCard'
import { getAlbums, getPhotosInAlbum } from '../../firebase/firebase-firestore'
import { isAdmin, useAuth } from '../../firebase/firebase-auth'
import { AlbumData, PhotoData } from '../../types'

import './editAlbum.css'

export const EditAlbum = () => {
    const [photos, setPhotos] = useState<PhotoData[]>([])
    const [albums, setAlbums] = useState<AlbumData[]>([])
    const [isAllowedToEdit, setIsAllowedToEdit] = useState<boolean>(false)
    const [currentAlbumName, setCurrentAlbumName] = useState<string>('featured')
    const user = useAuth()

    useEffect(() => {
        const checkIfAdmin = async () => {
            const allowed = await isAdmin(user?.uid)
            setIsAllowedToEdit(allowed)
        }
        checkIfAdmin()
    }, [user?.uid])

    useEffect(() => {
        const getAlbumList = async () => {
            const albumData = await getAlbums()
            setAlbums(albumData ?? [])
        }
        getAlbumList()
    }, [])

    useEffect(() => {
        const getPhotosForCurrentPage = async () => {
            const photoData = await getPhotosInAlbum(currentAlbumName)
            setPhotos(photoData ?? [])
        }
        getPhotosForCurrentPage()
    }, [currentAlbumName])

    return (
        <div className="main-grid edit-album-page">
            <MainNavBar />
            {isAllowedToEdit ? (
                <>
                    <div className="edit-album-page__album-select">
                        <label htmlFor="album-select">Album:</label>
                        <select
                            name="album"
                            id="album-select"
                            onChange={(e) =>
                                setCurrentAlbumName(e.currentTarget.value)
                            }
                        >
                            {albums.map((album) => (
                                <option
                                    key={album?.documentRef.id}
                                    value={album.name}
                                >
                                    {album.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="edit-album-page__current-album-header">
                        <h1>{currentAlbumName}</h1>
                    </div>
                    {photos.map((photo) => (
                        <EditPhotoDataCard key={photo.fileName} photo={photo} />
                    ))}
                </>
            ) : (
                <div className="edit-album-page__not-logged-in">
                    <h1>Du må logge inn som admin for å redigere</h1>
                    <Link to="/login">Login-side</Link>
                </div>
            )}
        </div>
    )
}

export default EditAlbum
