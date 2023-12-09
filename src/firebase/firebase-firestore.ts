/* eslint-disable no-console */

import { collection, getDocs, query, where } from 'firebase/firestore'

import type { PhotoData } from '../types'

import { db } from './firebase-init'

const OLD_ALBUM_COLLECTION = 'album'
const ALBUM_COLLECTION = 'albums'
const PHOTOS_COLLECTION = 'photos'
// const THUMBNAILS_FOLDER = 'thumbnails'
// const THUMBNAIL_PREFIX = 'thumb_'

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
            collection(db, ALBUM_COLLECTION, albumId, PHOTOS_COLLECTION),
        )
        const photosData = docSnap.docs.map((photo) =>
            photo.data(),
        ) as PhotoData[]
        return photosData
    } catch (e) {
        return Promise.reject('Could not fetch photos')
    }
}
