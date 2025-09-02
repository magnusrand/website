import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { writeBatch } from 'firebase/firestore'

import { PhotoData } from 'src/types'

import { db } from 'src/firebase/firebase-init'

import { MainNavBar } from '@components/NavBar/MainNavBar'
import EditPhotoDataCard from '@components/Admin/EditPhotoDataCard'
import { Label, TextField } from '@components/Form/Text'
import { Button } from '@components/Buttons/Button'

import { moveToIndex } from '@components/utils'

import {
    getAllPhotoTags,
    getPhotosInAlbum,
    updatePhotoData,
    uploadPhotosFromWeb,
    useAlbumsList,
} from '../../firebase/firebase-firestore'
import { isAdmin, useAuth } from '../../firebase/firebase-auth'

import './editAlbum.css'

export const EditAlbum = () => {
    const [photos, setPhotos] = useState<PhotoData[]>([])
    const [isAllowedToEdit, setIsAllowedToEdit] = useState<boolean>(false)
    const [currentAlbumName, setCurrentAlbumName] = useState<string | null>(
        null,
    )
    const [allPhotoTags, setAllPhotoTags] = useState<string[]>([])
    const [albumSort, setAlbumSort] = useState<string>('')
    const [photosForUpload, setPhotosForUpload] = useState<File[]>([])
    const [uploadFeedback, setUploadFeedback] = useState<string>('')
    const [photosForUploadAlbumName, setPhotosForUploadAlbumName] =
        useState<string>('')
    const [newPhotosOrder, setNewPhotosOrder] = useState<PhotoData[] | null>(
        null,
    )
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
        const getTags = async () => {
            const tags = await await getAllPhotoTags()
            setAllPhotoTags(tags)
        }
        getTags()
    }, [])

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

    useEffect(() => {
        const _currentAlbumName = searchParams.get('album')
        setAlbumSort(
            albums.find((album) => album.name === _currentAlbumName)?.sort ??
                '',
        )
    }, [searchParams, albums])

    function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>): void {
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

    async function updateAlbumCollection() {
        const albumCollectionInput = document.getElementById(
            'albumCollection',
        ) as HTMLInputElement | null
        const albumRef = photos?.[0].albumRef
        if (!albumCollectionInput || !albumRef) {
            return
        }
        await updatePhotoData(albumRef, {
            albumCollection: albumCollectionInput.value,
        })
    }

    const sortedPhotos = useMemo(() => {
        if (newPhotosOrder !== null) return newPhotosOrder

        if (albumSort === 'custom') {
            return photos.sort(
                (photoA, photoB) => photoA.priority - photoB.priority,
            )
        }

        return photos
    }, [photos, newPhotosOrder, albumSort])

    function handleOnIndexPostionChange(
        prevIndex: number,
        operation: 'increase' | 'decrease' | number,
    ) {
        const newIndex =
            operation === 'increase'
                ? prevIndex - 1
                : operation === 'decrease'
                ? prevIndex + 1
                : operation ?? prevIndex
        setNewPhotosOrder(moveToIndex(sortedPhotos, prevIndex, newIndex))
    }

    // Get a new write batch
    const batchForSortingOrder = writeBatch(db)

    async function updateSortingOrder() {
        let numberOfPhotosUpdated = 0
        if (newPhotosOrder === null) return
        const albumRef = photos?.[0].albumRef
        if (!albumRef) return
        newPhotosOrder.forEach((photo, index) => {
            if (photo.priority === index) return

            const photoRef = photo.documentRef
            batchForSortingOrder.update(photoRef, {
                priority: index,
            })
            numberOfPhotosUpdated++
        })
        batchForSortingOrder.update(albumRef, {
            sort: albumSort,
        })

        await batchForSortingOrder.commit()
        console.info(
            `Updated priority for ${numberOfPhotosUpdated} photos in album ${currentAlbumName}`,
        )
    }

    return (
        <div className="main-grid">
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
                            <div className="edit-album-page__album-collection-settings">
                                <div>
                                    <Label htmlFor="albumCollection">
                                        Albumsamling
                                    </Label>
                                    <div className="edit-album-page__album-collection-settings__field">
                                        <TextField id="albumCollection" />
                                        <Button
                                            className="type-sourcesans-regular"
                                            onClick={updateAlbumCollection}
                                        >
                                            Oppdater
                                        </Button>
                                    </div>
                                </div>
                                <div className="edit-album-page__album-sort">
                                    <Label htmlFor="album-sort">
                                        Sortering:{' '}
                                    </Label>
                                    <select
                                        name="sort"
                                        id="album-sort"
                                        onChange={(e) =>
                                            setAlbumSort(e.currentTarget.value)
                                        }
                                        value={albumSort ?? '-'}
                                    >
                                        {albumSort === '' && (
                                            <option key="nothing" value="">
                                                unset
                                            </option>
                                        )}
                                        {['asc', 'desc', 'custom'].map(
                                            (sort) => (
                                                <option key={sort} value={sort}>
                                                    {sort}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                    <button onClick={updateSortingOrder}>
                                        Oppdater
                                    </button>
                                </div>
                            </div>
                        </div>
                        {currentAlbumName !== null &&
                            sortedPhotos.map((photo, index) => (
                                <EditPhotoDataCard
                                    key={photo.fileName}
                                    photo={photo}
                                    albumName={currentAlbumName}
                                    allPhotoTags={allPhotoTags}
                                    index={
                                        albumSort === 'custom'
                                            ? index
                                            : undefined
                                    }
                                    maxIndex={photos.length - 1}
                                    onPositionChange={(operation) =>
                                        handleOnIndexPostionChange(
                                            index,
                                            operation,
                                        )
                                    }
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
