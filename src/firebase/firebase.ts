import axios from 'axios'
import {
    addDoc,
    collection,
    getDoc,
    getDocs,
    query,
    doc,
    where,
} from 'firebase/firestore'
import { PhotoData } from '../types'

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

export const getPhotosInAlbum = async (album: string) => {
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
        console.log(e)
    }
}

const photoLinkRegex = /gl\/(.*)/

export const createPhotoInAlbum = async (
    link: string,
    album: string,
    name: string,
): Promise<void> => {
    const photoLinkId = link.match(photoLinkRegex)
    if (!photoLinkId) return

    const albumQuery = query(
        collection(db, ALBUM_COLLECTION),
        where('name', '==', album),
    )

    try {
        const response = await axios.get(
            ` https://google-photos-album-demo2.glitch.me/${photoLinkId[1]}`,
        )

        const albumSnapshot = await getDocs(albumQuery)
        if (albumSnapshot.empty) return

        response.data.forEach((photoLink: string): void => {
            addDoc(
                collection(
                    db,
                    ALBUM_COLLECTION,
                    albumSnapshot.docs[0].id,
                    'photos',
                ),
                {
                    link: photoLink,
                    name: name ? name : 'not-named',
                    meta: {},
                },
            )
        })
    } catch (e) {
        console.error('number two', e)
    }
}
