/* eslint-disable no-console */

import {
    FieldPath,
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    where,
} from 'firebase/firestore'

import type { AlbumData, PhotoData } from '../types'

import { db } from './firebase-init'

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
    const photosData = docSnap.docs.map((photo) => photo.data()) as PhotoData[]
    return photosData
}

export const getAlbums = async () => {
    const albumSnapshot = await getDocs(collection(db, ALBUM_COLLECTION))
    if (albumSnapshot.empty) return []
    const albums = albumSnapshot.docs.map((album) => album.data() as AlbumData)

    return albums
}
