import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import MainNavBar from '../../components/NavBar/MainNavBar'
import EditPhotoDataCard from '../../components/Admin/EditPhotoDataCard'
import { getPhotosInAlbum } from '../../firebase/firebase-firestore'
import { PhotoData } from '../../types'

import './editAlbum.css'

export const EditAlbum = () => {
    const params = useParams()
    const [photos, setPhotos] = useState<PhotoData[]>([])
    const [photoDescription, setPhotoDescription] = useState<string>()

    const albumName = params.albumName?.toLowerCase()

    useEffect(() => {
        const getPhotosForCurrentPage = async () => {
            const photoData = await getPhotosInAlbum('featured')
            console.log('Got ', photoData.length, ' photos for current page')
            setPhotos(photoData ?? [])
        }
        getPhotosForCurrentPage()
    }, [albumName])

    return (
        <div className="main-grid edit-album-page">
            <MainNavBar />
            {photos.map((photo) => (
                <EditPhotoDataCard key={photo.fileName} photo={photo} />
            ))}
        </div>
    )
}

export default EditAlbum
