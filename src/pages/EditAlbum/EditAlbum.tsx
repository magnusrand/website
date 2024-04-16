import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import MainNavBar from '../../components/NavBar/MainNavBar'
import EditPhotoDataCard from '../../components/Admin/EditPhotoDataCard'
import {
    getPhotosInAlbum,
    uploadPhotosFromWeb,
    useAlbumsList,
} from '../../firebase/firebase-firestore'
import { isAdmin, useAuth } from '../../firebase/firebase-auth'
import { PhotoData } from '../../types'

import './editAlbum.css'

export const EditAlbum = () => {
    const [photos, setPhotos] = useState<PhotoData[]>([])
    const [isAllowedToEdit, setIsAllowedToEdit] = useState<boolean>(false)
    const [currentAlbumName, setCurrentAlbumName] = useState<string | null>(
        null,
    )
    const [photosForUpload, setPhotosForUpload] = useState<File[]>([])
    const [uploadFeedback, setUploadFeedback] = useState<string>('')
    const [photosForUploadAlbumName, setPhotosForUploadAlbumName] =
        useState<string>('')
    const user = useAuth()
    const albums = useAlbumsList()

    useEffect(() => {
        const checkIfAdmin = async () => {
            const allowed = await isAdmin(user?.uid)
            setIsAllowedToEdit(allowed)
        }
        checkIfAdmin()
    }, [user?.uid])

    useEffect(() => {
        const getPhotosForCurrentPage = async () => {
            if (currentAlbumName !== null) {
                const photoData = await getPhotosInAlbum(currentAlbumName)
                setPhotos(photoData ?? [])
            }
        }
        getPhotosForCurrentPage()
    }, [currentAlbumName])

    const handleFileSelected = (
        e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        const files = Array.from(e.target.files ?? [])
        setPhotosForUpload(files)
        console.log('files:', files)
    }

    async function uploadPhotos() {
        const currentAlbums = albums.map((album) => album.name)
        const albumAlreadyExists = currentAlbums.includes(
            photosForUploadAlbumName,
        )
        console.log(
            'cur:',
            currentAlbums,
            'exists:',
            albumAlreadyExists,
            'foto length',
            photosForUpload.length,
        )

        if (!albumAlreadyExists && photosForUpload.length > 1) {
            return setUploadFeedback(
                'Dette albumet finnes ikke fra før. Last opp ett (1) bilde til å begynne med',
            )
        }
        if (photosForUpload && photosForUploadAlbumName !== '') {
            await uploadPhotosFromWeb(photosForUpload, photosForUploadAlbumName)
            setPhotosForUpload([])
            setPhotosForUploadAlbumName('')
            setUploadFeedback('')
        } else {
            setUploadFeedback('Mangler bilder eller albumnavn')
        }
    }

    return (
        <div className="main-grid edit-album-page">
            <MainNavBar />
            <div className="edit-album-page__upload">
                <input
                    name="photo_upload"
                    type="file"
                    multiple
                    onChange={handleFileSelected}
                />
                <input
                    name="photo_album_name"
                    type="text"
                    value={photosForUploadAlbumName}
                    onChange={(e) =>
                        setPhotosForUploadAlbumName(e.target.value)
                    }
                />
                <button onClick={uploadPhotos}>LAST DET OPP!</button>
                {uploadFeedback !== '' && <div>{uploadFeedback}</div>} 
            </div>
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
                            {currentAlbumName === null && (
                                <option key="nothing" value="-">
                                    -
                                </option>
                            )}
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
                        <h1>{currentAlbumName ?? 'Velg album'}</h1>
                    </div>
                    {currentAlbumName !== null &&
                        photos.map((photo) => (
                            <EditPhotoDataCard
                                key={photo.fileName}
                                photo={photo}
                                albumName={currentAlbumName}
                            />
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
