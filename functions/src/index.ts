import { storage } from 'firebase-functions/v2'
import { onCall } from 'firebase-functions/v2/https'
import { initializeApp } from 'firebase-admin/app'
import {
    getStorage as getStorageAdmin,
    getDownloadURL,
} from 'firebase-admin/storage'
import { getFirestore } from 'firebase-admin/firestore'
import { error, log } from 'firebase-functions/logger'

import * as sharp from 'sharp'

initializeApp()

const ALBUM_COLLECTION = 'albums'
const PHOTOS_COLLECTION = 'photos'
const DISPLAY_PREFIX = 'disp_'
const DISPLAYS_FOLDER = 'displays'
const THUMBNAILS_FOLDER = 'thumbnails'
const THUMBNAIL_PREFIX = 'thumb_'
const THUMBNAIL_HEIGHT = 100

export const createDisplayAndThumbnailForUploadedImage =
    storage.onObjectFinalized(
        { region: 'europe-north1', timeoutSeconds: 300, memory: '1GiB' },
        async (object) => {
            try {
                const filePath = object.data.name as string
                const splitFilePath = filePath?.split('/')
                const fileName = filePath?.includes('/')
                    ? splitFilePath[splitFilePath.length - 1]
                    : filePath
                const fileBucket = object.bucket

                // Check if the uploaded file is an image
                if (!filePath?.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/i)) {
                    // File is not an image. Gracefully exiting document creation
                    return null
                }

                // check if the uploaded file is a thumbnail or display version
                if (
                    fileName?.startsWith(THUMBNAIL_PREFIX) ||
                    fileName?.startsWith(DISPLAY_PREFIX)
                ) {
                    // File is a thumbnail or display version. Gracefully exiting document createion
                    return null
                }

                if (splitFilePath[0] !== ALBUM_COLLECTION) {
                    // Image not in 'albums'. Gracefully exiting document createion
                    return null
                }

                const albumName = splitFilePath[1]

                const bucket = getStorageAdmin().bucket(fileBucket)
                const file = bucket.file(filePath)
                const _file = await file.download().then((data) => data[0])

                // Generate web display version
                const webDisplayBuffer = await sharp(_file)
                    .resize({
                        width: 1600,
                        withoutEnlargement: true,
                    })
                    .webp({
                        quality: 100,
                    })
                    .toBuffer()

                const displayImageFileName = `${DISPLAY_PREFIX}${
                    fileName.match(/^(.*)(?=\.)/)?.[0] ?? fileName
                }.webp`
                const displayImageFilePath = `${ALBUM_COLLECTION}/${albumName}/${DISPLAYS_FOLDER}/${displayImageFileName}`

                // upload display data
                await bucket.file(displayImageFilePath).save(webDisplayBuffer)

                // get url for display version
                const _displayFileBucket = bucket.file(displayImageFilePath)
                const _displayPublicUrl = await getDownloadURL(
                    _displayFileBucket,
                )

                // Generate a thumbnail
                const thumbnailBuffer = await sharp(_file)
                    .resize({
                        height: THUMBNAIL_HEIGHT,
                        withoutEnlargement: true,
                    })
                    .toBuffer()

                const thumbnailFileName = `${THUMBNAIL_PREFIX}${fileName}`
                const thumbnailFilePath = `${ALBUM_COLLECTION}/${albumName}/${THUMBNAILS_FOLDER}/${thumbnailFileName}`

                // upload thumbnail data
                await bucket.file(thumbnailFilePath).save(thumbnailBuffer)

                // get url for thumbnail version
                const _thumbnailFileBucket = bucket.file(thumbnailFilePath)
                const _thumbnailPublicUrl = await getDownloadURL(
                    _thumbnailFileBucket,
                )

                // Update existing document with urls for thumbnail and display version
                const albumSnapshot = await getFirestore()
                    .collection(ALBUM_COLLECTION)
                    .where('name', '==', albumName)
                    .get()
                const albumRef = albumSnapshot?.docs?.[0]?.ref
                const photoSnapshot = await getFirestore()
                    .collection(`${albumRef.path}/${PHOTOS_COLLECTION}`)
                    .where('fileName', '==', fileName)
                    .get()
                const photoRef = photoSnapshot?.docs?.[0]?.ref
                await getFirestore().doc(photoRef.path).update({
                    imageUrl: _displayPublicUrl,
                    thumbnailUrl: _thumbnailPublicUrl,
                })

                // Get number of photos in album
                const numberOfPhotosInAlbum = await getFirestore()
                    .collection(`${albumRef.path}/${PHOTOS_COLLECTION}`)
                    .count()
                    .get()
                    .then((result) => result.data().count)

                // Check if album needs coverphoto
                const albumHasCoverPhoto =
                    albumSnapshot?.docs?.[0].data().coverPhotoUrl !== ''
                const valueForCoverPhoto = albumHasCoverPhoto
                    ? {}
                    : { coverPhotoUrl: _displayPublicUrl }

                // Update values for number of photos and cover photo for album
                await getFirestore()
                    .doc(albumRef.path)
                    .update({
                        numberOfPhotos: numberOfPhotosInAlbum,
                        ...valueForCoverPhoto,
                    })

                log('Successfully created display and thumbnail for', filePath)
                return null
            } catch {
                error(
                    'Error while creating display and thumbnail for',
                    object.data.name,
                )
                return null
            }
        },
    )

export const removeDocumentsForDeletedPhoto = storage.onObjectDeleted(
    { region: 'europe-north1' },
    async (object) => {
        try {
            const filePath = object.data.name as string
            const splitFilePath = filePath?.split('/')
            const fileName = filePath?.includes('/')
                ? splitFilePath[splitFilePath.length - 1]
                : filePath
            const albumName = splitFilePath?.[1]

            if (splitFilePath?.[0] !== ALBUM_COLLECTION) {
                // Photo not part of albums! Gracefull exiting delete process
                return null
            }

            // check if the deleted file is a thumbnail or display version
            if (
                fileName?.startsWith(THUMBNAIL_PREFIX) ||
                fileName?.startsWith(DISPLAY_PREFIX)
            ) {
                // File is a thumbnail or display version. Gracefully exiting delete process.
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
                // delete the photo document in firestore
                doc?.ref?.delete()

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

            // delete the thumbnail
            const thumbnailFileName = `${THUMBNAIL_PREFIX}${fileName}`
            const thumbnailFilePath = `${ALBUM_COLLECTION}/${albumName}/${THUMBNAILS_FOLDER}/${thumbnailFileName}`
            const thumbnailFile = getStorageAdmin()
                .bucket(object.bucket)
                .file(thumbnailFilePath)
            thumbnailFile.delete()

            log('Successfully deleted data related to', object.data.name)
            return true
        } catch {
            error('Error occurred while deleting', object.data.name)
            return null
        }
    },
)

export const deleteImageFromStorage = onCall(
    { cors: true, region: 'europe-north1' },
    async (request) => {
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
