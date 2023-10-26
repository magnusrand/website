import { https, storage, logger } from 'firebase-functions'
import { initializeApp } from 'firebase-admin/app'
import { getStorage as getStorageAdmin } from 'firebase-admin/storage'
// import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import * as cors from 'cors'
import axios from 'axios'

const ExifImage = require('exif').ExifImage
// import fetch from 'node-fetch'

/* eslint-disable no-console */

initializeApp()

// const db = admin.getDatabase

const ALBUM_COLLECTION = 'album'

function extractPhotoLinksFromContent(content: string): string[] {
    const regex =
        /src="(https:\/\/lh3\.googleusercontent\.com\/pw\/[a-zA-Z0-9\-_]*)=[a-zA-Z0-9\-_]*"/g
    const links = new Set<string>()
    let match
    while ((match = regex.exec(content))) {
        links.add(match[1])
    }
    return Array.from(links)
}

export const createAlbum = storage.object().onFinalize(async (object) => {
    const filePath = object.name
    const fileBucket = object.bucket

    const albumName = filePath?.includes('/')
        ? filePath?.split('/')[0]
        : 'unknown'

    console.log('filePath is', filePath)

    // Check if the uploaded file is an image
    if (!filePath?.match(/\.(jpg|jpeg|png|gif)$/)) {
        console.log('File is not an image')
        return null
    }

    // Get the download URL for the uploaded file
    const bucket = getStorageAdmin().bucket(fileBucket)
    const file = bucket.file(filePath)
    const url = await file.publicUrl()

    // Create a new document in Firestore with the image URL
    // TODO check if album with albumName exists
    const albumRef = getFirestore().collection('albums').doc()

    const photoRef = albumRef.collection('photos').doc()

    await albumRef.set({ name: albumName })
    await photoRef.set({ imageUrl: url })

    console.log('Album created with URL:', url)

    return null
})
