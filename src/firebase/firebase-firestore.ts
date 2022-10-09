/* eslint-disable no-console */

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

const photoLinkRegex = /gl\/(.*)/

export const createPhotosInAlbum = async (
    link: string,
    album: string,
    name: string,
): Promise<number> => {
    const photoLinkId = link.match(photoLinkRegex)
    if (!photoLinkId) {
        console.error('Wrong link format')
        return 0
    }

    const albumQuery = query(
        collection(db, ALBUM_COLLECTION),
        where('name', '==', album),
    )

    console.info('✓ Correct link format')

    try {
        const response = await axios.get(
            ` https://google-photos-album-demo2.glitch.me/${photoLinkId[1]}`,
        )

        const albumSnapshot = await getDocs(albumQuery)
        console.info('✓ Data and firestore snapshot fetched')

        let docId = ''

        if (albumSnapshot.empty) {
            const docRef = await addDoc(collection(db, ALBUM_COLLECTION), {
                name: album,
                numberOfPhotos: 0,
                coverPhoto: '',
            })
            docId = docRef.id
        } else {
            docId = albumSnapshot.docs[0].id
        }
        console.info('✓ New album created in firestore')

        response.data.forEach(async (photoLink: string): Promise<void> => {
            // const metadata = await urlMetadata(photoLink)
            const img = await getMeta(photoLink)
            addDoc(collection(db, ALBUM_COLLECTION, docId, 'photos'), {
                link: photoLink,
                name: name ? name : 'not-named',
                meta: {
                    width: img.width,
                    height: img.height,
                    orientation:
                        Number.parseInt(img.width) /
                            Number.parseInt(img.height) >
                        1
                            ? 'landscape'
                            : 'portrait',
                },
            })
        })
        console.info('✓ Photo links added to firestore')
        return response.data.length
    } catch (e) {
        console.error('Something went wrong when fetching data', e)
        return 0
    }
}

const getMeta = (url: string): Promise<any> =>
    new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject()
        img.src = url
    })
