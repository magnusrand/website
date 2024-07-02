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
    addDoc,
} from 'firebase/firestore'
import {
    StorageReference,
    getDownloadURL,
    ref,
    uploadBytesResumable,
} from 'firebase/storage'
import { httpsCallable } from 'firebase/functions'

import * as exifr from 'exifr'

import type { AlbumData, PhotoData } from '../types'

import { db, functions, storage } from './firebase-init'
import { META_DATA_FIELDS } from './utils'

const ALBUM_COLLECTION = 'albums'
const PHOTOS_COLLECTION = 'photos'
// const THUMBNAILS_FOLDER = 'thumbnails'
// const THUMBNAIL_PREFIX = 'thumb_'

export const getPhotosInAlbum = async (albumName: string | undefined) => {
    const albumQuery = query(
        collection(db, ALBUM_COLLECTION),
        where('name', '==', albumName),
    )

    const albumSnapshot = await getDocs(albumQuery)
    if (albumSnapshot.empty) return []
    const albumRef = albumSnapshot.docs[0].ref

    const sortPreference = albumSnapshot.docs[0].data().sort || 'desc'

    const photosQuery = query(
        collection(db, `${albumRef.path}/${PHOTOS_COLLECTION}`),
        orderBy(new FieldPath('metaData', 'CreateDate'), sortPreference),
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
    // CHECK IF ALBUM EXISTS IN FIRESTORE
    const albumQuery = query(
        collection(db, ALBUM_COLLECTION),
        where('name', '==', albumName),
    )
    const albumSnapshot = await getDocs(albumQuery)
    let albumRef = albumSnapshot?.docs?.[0]?.ref
    // IF NOT EXISTS CREATE AND AWAIT ALBUM
    if (albumSnapshot.empty) {
        const emptyAlbumData = {
            name: albumName.toLowerCase(),
            numberOfPhotos: 0,
            coverPhotoUrl: '',
        }
        albumRef = await addDoc(
            collection(db, ALBUM_COLLECTION),
            emptyAlbumData,
        )
    }

    // UPLOAD ALL PHOTOS TO STORAGE AND AFTER UPLOAD PHOTO CREATE FIRESTORE DOC
    files.forEach(async (file) => {
        const newPhotoData = {
            title: '',
            description: '',
            imageUrl: '',
            downloadUrl: '',
            thumbnailUrl: '',
            fileName: file.name,
            priority: 1,
            metaData: {
                orientation: '',
            },
        }
        const photoDocRef = await addDoc(
            collection(albumRef, 'photos'),
            newPhotoData,
        )
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
                updateDocumentWithPhotoData(file, storageRef, photoDocRef)
            },
        )
    })
}

export async function updateDocumentWithPhotoData(
    file: File,
    photoStorageRef: StorageReference,
    photoDocumentRef: DocumentReference,
) {
    const downloadUrl = await getDownloadURL(photoStorageRef)
    const metaData = await exifr.parse(file, META_DATA_FIELDS).catch((e) => {
        console.error('Error parsing EXIF data:', e)
        return {}
    })

    updateDoc(photoDocumentRef, {
        downloadUrl,
        metaData: { ...metaData, orientation: '' },
    })
}
