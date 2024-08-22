import React, { useEffect, useState } from 'react'

import { Link, useSearchParams } from 'react-router-dom'

import MainNavBar from '../../components/NavBar/MainNavBar'
import EditPhotoDataCard from '../../components/Admin/EditPhotoDataCard'
import { Label, TextField } from '../../components/Form/Text'
import { Button } from '../../components/Buttons/Button'
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
    const [searchParams, setSearchParams] = useSearchParams()
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
            const _currentAlbumName = searchParams.get('album')
            setCurrentAlbumName(_currentAlbumName)

            if (_currentAlbumName) {
                const photoData = await getPhotosInAlbum(_currentAlbumName)
                setPhotos(photoData ?? [])
                setPhotosForUploadAlbumName(_currentAlbumName)
            }
        }
        getPhotosForCurrentPage()
    }, [searchParams])

    const handleFileSelected = (
        e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        const files = Array.from(e.target.files ?? [])
        setPhotosForUpload(files)
    }

    async function uploadPhotos() {
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
        <div className="main-grid">
            <MainNavBar />
            <div className="edit-album-page">
                {isAllowedToEdit ? (
                    <>
                        <div className="edit-album-page__upload">
                            <Label>Velg bilder</Label>
                            <input
                                name="photo_upload"
                                type="file"
                                multiple
                                onChange={handleFileSelected}
                                style={{ marginBottom: '1rem' }}
                            />
                            <Label>Velg album</Label>
                            <TextField
                                name="photo_album_name"
                                value={photosForUploadAlbumName}
                                onChange={(e) =>
                                    setPhotosForUploadAlbumName(e.target.value)
                                }
                                style={{ marginBottom: '1rem' }}
                            />
                            <Button onClick={uploadPhotos}>Last opp</Button>
                            {uploadFeedback !== '' && (
                                <div>{uploadFeedback}</div>
                            )}
                        </div>
                        <div className="edit-album-page__album-select">
                            <Label htmlFor="album-select">Album: </Label>
                            <select
                                name="album"
                                id="album-select"
                                onChange={(e) =>
                                    setSearchParams({
                                        album: e.currentTarget.value,
                                    })
                                }
                                value={currentAlbumName ?? '-'}
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

                        <div className="edit-album-page__current-album-header type-garamond-regular font-size-medium">
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
        </div>
    )
}

export default EditAlbum
