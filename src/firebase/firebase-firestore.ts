/* eslint-disable no-console */

import {
    collection,
    getDoc,
    getDocs,
    query,
    doc,
    where,
} from 'firebase/firestore'

import type { PhotoData } from '../types'

import { db } from './firebase-init'

const ALBUM_COLLECTION = 'album'

export const getPhoto = async (): Promise<string> => {
    const photoDoc = await getDoc(
        doc(
            collection(db, 'album', 'YHkzx1CvWeINqrBAupGl', 'photos'),
            'YLS2GFXolGpNW4tKbbxG',
        ),
    )
    const photoLink = photoDoc.data()?.link
    return photoLink ?? ''
}

export const getPhotosInAlbum = async (album: string | undefined) => {
    const albumQuery = query(
        collection(db, ALBUM_COLLECTION),
        where('name', '==', album),
    )
    try {
        const albumSnapshot = await getDocs(albumQuery)
        if (albumSnapshot.empty) return []
        const albumId = albumSnapshot.docs[0].id

        const docSnap = await getDocs(
            collection(db, ALBUM_COLLECTION, albumId, 'photos'),
        )
        const photosData = docSnap.docs.map((photo) =>
            photo.data(),
        ) as PhotoData[]
        return photosData
    } catch (e) {
        return Promise.reject('Could not fetch photos')
    }
}
