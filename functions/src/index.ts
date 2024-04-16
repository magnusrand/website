import { storage } from 'firebase-functions/v2'
import { onCall } from 'firebase-functions/v2/https'
import { initializeApp } from 'firebase-admin/app'
import {
    getStorage as getStorageAdmin,
    getDownloadURL,
} from 'firebase-admin/storage'
import { getFirestore } from 'firebase-admin/firestore'
import { log } from 'firebase-functions/logger'

import * as exifr from 'exifr'
import * as sharp from 'sharp'

import { META_DATA_FIELDS } from './utils'

initializeApp()

const ALBUM_COLLECTION = 'albums'
const PHOTOS_COLLECTION = 'photos'
const DISPLAY_PREFIX = 'disp_'
const DISPLAYS_FOLDER = 'displays'
const THUMBNAILS_FOLDER = 'thumbnails'
const THUMBNAIL_PREFIX = 'thumb_'
const THUMBNAIL_HEIGHT = 100

export const createDocumentForFiles = onCall(
    { cors: true, region: 'europe-north1' },
    async (request) => {
        const { albumName, files } = request.data

        const bucket = getStorageAdmin().bucket()
        const albumRef = getFirestore().collection(ALBUM_COLLECTION).doc()

        await albumRef.set({
            name: albumName,
            numberOfPhotos: files.length,
            coverPhotoUrl: '',
        })

        for (const file of files) {
            const fileName = file.name
            const filePath = `${ALBUM_COLLECTION}/${albumName}/${fileName}`

            const fileBuffer = Buffer.from(file.data, 'base64')
            await bucket.file(filePath).save(fileBuffer)

            const publicUrl = await getDownloadURL(bucket.file(filePath))
            const meta = await exifr
                .parse(fileBuffer, META_DATA_FIELDS)
                .then((output) => output)
                .catch((e) => {
                    log('Error parsing EXIF data:', e)
                    return {}
                })

            const newPhotoData = {
                title: '',
                description: '',
                imageUrl: publicUrl,
                downloadUrl: publicUrl,
                thumbnailUrl: publicUrl,
                fileName: fileName,
                priority: 1,
                metaData: {
                    ...meta,
                    orientation:
                        meta.ExifImageHeight > meta.ExifImageWidth
                            ? 'portrait'
                            : 'landscape',
                },
            }

            const photoRef = albumRef.collection(PHOTOS_COLLECTION).doc()
            await photoRef.set(newPhotoData)

            log('Photo', fileName, 'created in album', albumName)
        }
    },
)
export const createDocumentForUploadedPhotoInAlbum = storage.onObjectFinalized(
    { region: 'europe-north1' },
    async (object) => {
        const filePath = object.data.name as string
        const splitFilePath = filePath?.split('/')
        const fileName = filePath?.includes('/')
            ? splitFilePath[splitFilePath.length - 1]
            : filePath
        const fileBucket = object.bucket

        log('filePath is', filePath)

        // Check if the uploaded file is an image
        if (!filePath?.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/i)) {
            log('File is not an image. Gracefully exiting document creation.')
            return null
        }

        // check if the uploaded file is a thumbnail or display version
        if (
            fileName?.startsWith(THUMBNAIL_PREFIX) ||
            fileName?.startsWith(DISPLAY_PREFIX)
        ) {
            log(
                'File is a thumbnail or display version. Gracefully exiting document createion.',
            )
            return null
        }

        if (splitFilePath[0] !== ALBUM_COLLECTION) {
            log("Image not in 'albums'. Gracefully exiting document createion.")
            return null
        }

        const albumName = splitFilePath[1]

        // Get the download URL for the uploaded file
        const bucket = getStorageAdmin().bucket(fileBucket)
        const file = bucket.file(filePath)
        const _file = await file.download().then((data) => data[0])
        const publicUrl = await getDownloadURL(file)
        const meta = await exifr
            .parse(_file, META_DATA_FIELDS)
            .then((output) => output)
            .catch((e) => {
                log('Error parsing EXIF data:', e)
                return {}
            })

        // Generate web display version
        const webDisplayBuffer = await sharp(_file)
            .resize({
                width: 1600,
                withoutEnlargement: true,
            })
            // .toFormat('webp')
            .webp({
                quality: 100,
            })
            .toBuffer()

        const displayImageFileName = `${DISPLAY_PREFIX}${
            fileName.match(/^(.*)(?=\.)/)?.[0] ?? fileName
        }.webp`
        const displayImageFilePath = `${ALBUM_COLLECTION}/${albumName}/${DISPLAYS_FOLDER}/${displayImageFileName}`

        await bucket.file(displayImageFilePath).save(webDisplayBuffer)
        log('Display version created and uploaded!')

        const _displayFileBucket = bucket.file(displayImageFilePath)
        const _displayPublicUrl = await getDownloadURL(_displayFileBucket)
        log('Display version url generated')

        // Generate a thumbnail
        const thumbnailBuffer = await sharp(_file)
            .resize({
                height: THUMBNAIL_HEIGHT,
                withoutEnlargement: true,
            })
            .toBuffer()

        const thumbnailFileName = `${THUMBNAIL_PREFIX}${fileName}`
        const thumbnailFilePath = `${ALBUM_COLLECTION}/${albumName}/${THUMBNAILS_FOLDER}/${thumbnailFileName}`

        await bucket.file(thumbnailFilePath).save(thumbnailBuffer)
        log('Thumbnail created and uploaded!')

        const _thumbnailFileBucket = bucket.file(thumbnailFilePath)
        const _thumbnailPublicUrl = await getDownloadURL(_thumbnailFileBucket)
        log('Thumbnail url generated')

        const newPhotoData = {
            title: '',
            description: '',
            imageUrl: _displayPublicUrl,
            downloadUrl: publicUrl,
            thumbnailUrl: _thumbnailPublicUrl,
            fileName: fileName,
            priority: 1,
            metaData: {
                ...meta,
                orientation:
                    meta.ExifImageHeight > meta.ExifImageWidth
                        ? 'portrait'
                        : 'landscape',
            },
        }

        const albumQuery = getFirestore()
            .collection(ALBUM_COLLECTION)
            .where('name', '==', albumName)
        const querySnapshot = await albumQuery.get()
        const albumAlreadyExists = !querySnapshot.empty

        if (albumAlreadyExists) {
            // Update the existing album with the new image
            const albumRef = querySnapshot.docs?.[0]?.ref
            albumRef.collection(PHOTOS_COLLECTION).add(newPhotoData)

            const numberOfPhotosInAlbum =
                (
                    await albumRef.collection(PHOTOS_COLLECTION).count().get()
                ).data().count + 1

            await albumRef.update({
                numberOfPhotos: numberOfPhotosInAlbum,
            })

            log(
                'Album',
                albumName,
                'updated with photo:',
                fileName,
                'and URL:',
                publicUrl,
            )
            log('Number of photos in album is now:', numberOfPhotosInAlbum)
        } else {
            // Create a new document with the image
            const albumRef = getFirestore().collection(ALBUM_COLLECTION).doc()
            await albumRef.set({
                name: albumName,
                numberOfPhotos: 1,
                coverPhotoUrl: publicUrl,
            })

            const photoRef = albumRef.collection(PHOTOS_COLLECTION).doc()
            await photoRef.set(newPhotoData)

            log(
                'Album',
                albumName,
                'created with photo:',
                fileName,
                'and URL:',
                publicUrl,
            )
        }

        return null
    },
)

export const removeDocumentsForDeletedPhoto = storage.onObjectDeleted(
    { region: 'europe-north1' },
    async (object) => {
        const filePath = object.data.name as string
        const splitFilePath = filePath?.split('/')
        const fileName = filePath?.includes('/')
            ? splitFilePath[splitFilePath.length - 1]
            : filePath
        const albumName = splitFilePath?.[1]

        if (splitFilePath?.[0] !== ALBUM_COLLECTION) {
            log('Photo not part of albums! Gracefull exiting delete process.')
            return null
        }

        // check if the deleted file is a thumbnail or display version
        if (
            fileName?.startsWith(THUMBNAIL_PREFIX) ||
            fileName?.startsWith(DISPLAY_PREFIX)
        ) {
            log(
                'File is a thumbnail or display version. Gracefully exiting delete process.',
            )
            return null
        }

        // get album-document with the name of the folder the photo was in
        const albumWithPhotoSnapshot = await getFirestore()
            .collection(ALBUM_COLLECTION)
            .where('name', '==', albumName)
            .get()

        // find all documents within the album with the same fileName as the deleted photo
        const photosWithFileNameSnapshot =
            await albumWithPhotoSnapshot.docs?.[0]?.ref
                .collection(PHOTOS_COLLECTION)
                .where('fileName', '==', fileName)
                .get()

        photosWithFileNameSnapshot.forEach(async (doc) => {
            doc?.ref?.delete()
            log('Successfully deleted photo document:', doc.id)

            // update the album's numberOfPhotos
            const updatedNumberOfPhotosInAlbum = (
                await albumWithPhotoSnapshot.docs?.[0]?.ref
                    .collection(PHOTOS_COLLECTION)
                    .count()
                    .get()
            ).data().count
            albumWithPhotoSnapshot.docs?.[0]?.ref.update({
                numberOfPhotos: updatedNumberOfPhotosInAlbum,
            })
            log(
                'Successfully updated number of photos in:',
                albumName,
                'to:',
                updatedNumberOfPhotosInAlbum,
            )
        })

        // delete the diplay version
        const displayFileName = `${DISPLAY_PREFIX}${
            fileName.match(/(.*)(?=\.)/)?.[0] ?? fileName
        }.webp`
        const displayFilePath = `${ALBUM_COLLECTION}/${albumName}/${DISPLAYS_FOLDER}/${displayFileName}`
        const displayFile = getStorageAdmin()
            .bucket(object.bucket)
            .file(displayFilePath)
        displayFile.delete()
        log('Successfully deleted display version:', displayFileName)

        // delete the thumbnail
        const thumbnailFileName = `${THUMBNAIL_PREFIX}${fileName}`
        const thumbnailFilePath = `${ALBUM_COLLECTION}/${albumName}/${THUMBNAILS_FOLDER}/${thumbnailFileName}`
        const thumbnailFile = getStorageAdmin()
            .bucket(object.bucket)
            .file(thumbnailFilePath)
        thumbnailFile.delete()
        log('Successfully deleted thumbnail:', thumbnailFileName)
        return true
    },
)

export const deleteImageFromStorage = onCall(
    { cors: true, region: 'europe-north1' },
    async (request) => {
        log('GELOLZ1')
        try {
            const storageBucket = getStorageAdmin().bucket()
            const filePath = `${ALBUM_COLLECTION}/${request.data.albumName}/${request.data.fileName}`

            await storageBucket.file(filePath).delete()

            log(
                'File',
                request.data.fileName,
                'in album',
                request.data.albumName,
                'deleted successfully',
            )
        } catch (error) {
            log('Error deleting file', request.data.fileName)
        }
    },
)
