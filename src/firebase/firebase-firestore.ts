/* eslint-disable no-console */
import { useEffect, useState } from 'react'

import {
    FieldPath,
    collection,
    getDocs,
    orderBy,
    query,
    where,
    updateDoc,
    DocumentReference,
    onSnapshot,
    addDoc,
    collectionGroup,
    limit,
} from 'firebase/firestore'
import {
    StorageReference,
    getDownloadURL,
    ref,
    uploadBytesResumable,
} from 'firebase/storage'
import { httpsCallable } from 'firebase/functions'

import * as exifr from 'exifr'

import type { AlbumData, PhotoData, metaData } from '../types'

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

    const sortPreference = albumSnapshot.docs[0].data().sort
    const usedSortPreference =
        (sortPreference === 'custom' ? 'desc' : sortPreference) ?? 'desc'

    const photosQuery = query(
        collection(db, `${albumRef.path}/${PHOTOS_COLLECTION}`),
        orderBy(new FieldPath('metaData', 'CreateDate'), usedSortPreference),
    )
    const docSnap = await getDocs(photosQuery)
    const photosData = docSnap.docs.map((photo) => ({
        ...photo.data(),
        documentRef: photo.ref,
        albumRef,
    })) as PhotoData[]

    return photosData
}

// WIP NOT TESTED
export const getPhotoInAlbum = async (
    albumName: string | undefined,
    fileName: string | undefined,
) => {
    if (!albumName || !fileName) return null

    const albumQuery = query(
        collection(db, ALBUM_COLLECTION),
        where('name', '==', albumName),
    )

    const albumSnapshot = await getDocs(albumQuery)
    if (albumSnapshot.empty) return null
    const albumRef = albumSnapshot.docs[0].ref

    const photoQuery = query(
        collection(db, `${albumRef.path}/${PHOTOS_COLLECTION}`),
        where('fileName', '==', fileName + '.jpg'), // Assuming the fileName is stored with .jpg extension
    )
    const photoSnapshot = await getDocs(photoQuery)
    if (photoSnapshot.empty) return null

    const photoData = {
        ...photoSnapshot.docs[0].data(),
        documentRef: photoSnapshot.docs[0].ref,
        albumRef,
    } as PhotoData

    return photoData
}

export const getPhotosByTag = async (searchString: string | null) => {
    const photosWithTagQuery = query(
        collectionGroup(db, 'photos'),
        where('tags', 'array-contains', searchString),
        orderBy(new FieldPath('metaData', 'CreateDate'), 'asc'),
    )

    const photosWithTagSnapshot = await getDocs(photosWithTagQuery)
    if (photosWithTagSnapshot.empty) return []

    const photosData = photosWithTagSnapshot.docs.map((photo) => ({
        ...photo.data(),
        documentRef: photo.ref,
    })) as PhotoData[]

    return photosData
}

export const getAllPhotoTags = async () => {
    const photoTagsQuery = query(
        collectionGroup(db, 'photos'),
        orderBy('tags', 'asc'),
        limit(100),
    )

    const photoTagsSnapshot = await getDocs(photoTagsQuery)

    const allTags = photoTagsSnapshot.docs.flatMap((photo) => photo.data().tags)

    const tagWithOccurrences = allTags.reduce((acc, tag) => {
        if (acc[tag]) acc[tag] = acc[tag] + 1
        else acc[tag] = 1

        return acc
    }, {})

    return Object.keys(tagWithOccurrences).sort(
        (a, b) => tagWithOccurrences[b] - tagWithOccurrences[a],
    )
}

export const getAlbums = async ({
    collectionName,
}: {
    collectionName?: string | null
}) => {
    const albumSnapshot = collectionName
        ? await getDocs(
              query(
                  collection(db, ALBUM_COLLECTION),
                  where('albumCollection', '==', collectionName.toLowerCase()),
              ),
          )
        : await getDocs(collection(db, ALBUM_COLLECTION))

    if (albumSnapshot.empty) return []
    const albums = albumSnapshot.docs.map(
        (album) => ({ ...album.data(), documentRef: album.ref } as AlbumData),
    )

    return albums
}

export const updatePhotoData = async (
    documentRef: DocumentReference,
    updatedPhotoData: Partial<PhotoData & AlbumData>,
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
    const safeAlbumName = albumName.toLowerCase().replace(' ', '-')
    // CHECK IF ALBUM EXISTS IN FIRESTORE
    const albumQuery = query(
        collection(db, ALBUM_COLLECTION),
        where('name', '==', safeAlbumName),
    )
    const albumSnapshot = await getDocs(albumQuery)
    let albumRef = albumSnapshot?.docs?.[0]?.ref
    // IF NOT EXISTS CREATE AND AWAIT ALBUM
    if (albumSnapshot.empty) {
        const emptyAlbumData = {
            name: safeAlbumName.toLowerCase(),
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
            `${ALBUM_COLLECTION}/${safeAlbumName}/${file.name}`,
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
    const metaData: metaData = await exifr
        .parse(file, META_DATA_FIELDS)
        .catch((e) => {
            console.error('Error parsing EXIF data:', e)
            return {}
        })

    let orientation =
        metaData?.ExifImageHeight && metaData.ExifImageWidth
            ? metaData.ExifImageWidth >= metaData.ExifImageHeight
                ? 'landscape'
                : 'portrait'
            : 'unknown'

    if (orientation === 'unknown') {
        const dimensions = await getImageDimensions(file)
        orientation =
            dimensions.width && dimensions.height
                ? dimensions.width >= dimensions.height
                    ? 'landscape'
                    : 'portrait'
                : 'truly unknown'
    }

    updateDoc(photoDocumentRef, {
        downloadUrl,
        metaData: {
            ...metaData,
            orientation,
        },
    })
}

async function getImageDimensions(file: File) {
    console.log(
        'INFO: exif dimensions not available, fetching from render instead',
    )
    return new Promise<{ width: number; height: number }>((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = function (e) {
            const img = new Image()

            img.onload = function () {
                const width = img?.naturalWidth ?? img?.width
                const height = img?.naturalHeight ?? img?.height
                resolve({ width, height })
            }

            img.onerror = function () {
                reject(new Error('Error loading image'))
            }

            img.src = e.target?.result as string
        }

        reader.onerror = function () {
            reject(new Error('Error reading file'))
        }

        reader.readAsDataURL(file)
    })
}
