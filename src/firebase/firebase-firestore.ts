/* eslint-disable no-console */
import { useEffect, useState } from 'react'

import {
    FieldPath,
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    where,
    updateDoc,
    DocumentReference,
    onSnapshot,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { httpsCallable } from 'firebase/functions'

import type { AlbumData, PhotoData } from '../types'

import { db, functions, storage } from './firebase-init'

const ALBUM_COLLECTION = 'albums'
const PHOTOS_COLLECTION = 'photos'
// const THUMBNAILS_FOLDER = 'thumbnails'
// const THUMBNAIL_PREFIX = 'thumb_'

export const getPhotosInAlbum = async (album: string | undefined) => {
    const albumQuery = query(
        collection(db, ALBUM_COLLECTION),
        where('name', '==', album),
    )

    const albumSnapshot = await getDocs(albumQuery)
    if (albumSnapshot.empty) return []
    const albumId = albumSnapshot.docs[0].id

    const photosQuery = query(
        collection(db, ALBUM_COLLECTION, albumId, PHOTOS_COLLECTION),
        orderBy(new FieldPath('metaData', 'CreateDate'), 'desc'),
        limit(50),
    )
    const docSnap = await getDocs(photosQuery)
    const photosData = docSnap.docs.map((photo) => ({
        ...photo.data(),
        documentRef: photo.ref,
    })) as PhotoData[]

    return photosData
}

export const getAlbums = async () => {
    const albumSnapshot = await getDocs(collection(db, ALBUM_COLLECTION))
    if (albumSnapshot.empty) return []
    const albums = albumSnapshot.docs.map(
        (album) => ({ ...album.data(), documentRef: album.ref } as AlbumData),
    )

    return albums
}

export const updatePhotoData = async (
    documentRef: DocumentReference,
    updatedPhotoData: Partial<PhotoData>,
) => {
    const updatedPhotoDataWithoutMetaData = Object.entries(updatedPhotoData)
        .filter((data) => data[0] !== 'metaData')
        .reduce(
            (accumulator, currentValue) => ({
                ...accumulator,
                [currentValue?.[0]]: currentValue?.[1],
            }),
            {},
        )
    if (updatedPhotoData.metaData !== undefined) {
        const flattenedMetaData = Object.entries(
            updatedPhotoData.metaData ?? {},
        ).reduce(
            (accumulator, currentValue) => ({
                ...accumulator,
                [`metaData.${currentValue?.[0]}`]: currentValue?.[1],
            }),
            {},
        )
        await updateDoc(documentRef, {
            ...updatedPhotoDataWithoutMetaData,
            ...flattenedMetaData,
        })
        return
    }

    await updateDoc(documentRef, updatedPhotoDataWithoutMetaData)
}

export const deleteImageFromStorage = httpsCallable<{
    albumName: string
    fileName: string
}>(functions, 'deleteImageFromStorage')

export function useAlbumsList() {
    const [albums, setAlbums] = useState<AlbumData[]>([])
    useEffect(() => {
        const q = query(collection(db, ALBUM_COLLECTION))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const _albums = querySnapshot.docs.map(
                (album) =>
                    ({ ...album.data(), documentRef: album.ref } as AlbumData),
            )
            console.log('getting albums. Length:', _albums.length)

            setAlbums(_albums)
        })
        return unsubscribe
    }, [])
    return albums
}

export async function uploadPhotosFromWeb(files: File[], albumName: string) {
    files.forEach(async (file) => {
        const storageRef = ref(
            storage,
            `${ALBUM_COLLECTION}/${albumName}/${file.name}`,
        )
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log('Upload is ' + progress + '% done')
            },
            (error) => {
                // On error
                console.log(error)
            },
            () => {
                // On success
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL)
                })
            },
        )
    })
}
