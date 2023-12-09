import { storage } from 'firebase-functions'
import { initializeApp } from 'firebase-admin/app'
import { getStorage as getStorageAdmin } from 'firebase-admin/storage'
import { getFirestore } from 'firebase-admin/firestore'
import { log } from 'firebase-functions/logger'

import * as exifr from 'exifr'
import * as sharp from 'sharp'

import { META_DATA_FIELDS } from './utils'

initializeApp()

const ALBUM_COLLECTION = 'albums'
const PHOTOS_COLLECTION = 'photos'
const THUMBNAILS_FOLDER = 'thumbnails'
const THUMBNAIL_PREFIX = 'thumb_'
const THUMBNAIL_HEIGHT = 100

export const createDocumentForUploadedPhotoInAlbum = storage
    .object()
    .onFinalize(async (object) => {
        const filePath = object.name as string
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

        // check if the uploaded file is a thumbnail
        if (fileName?.startsWith(THUMBNAIL_PREFIX)) {
            log('File is a thumbnail. Gracefully exiting document createion.')
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
        const publicUrl = await file.publicUrl()
        const meta = await exifr
            .parse(_file, META_DATA_FIELDS)
            .then((output) => output)
            .catch((e) => {
                log('Error parsing EXIF data:', e)
                return {}
            })

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
        const _thumbnailPublicUrl = await _thumbnailFileBucket.publicUrl()
        log('Thumbnail url added to document')

        const newPhotoData = {
            title: '',
            description: '',
            imageUrl: publicUrl,
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
    })

export const removeDocumentsForDeletedPhoto = storage
    .object()
    .onDelete(async (object) => {
        const filePath = object.name as string
        const splitFilePath = filePath?.split('/')
        const fileName = filePath?.includes('/')
            ? splitFilePath[splitFilePath.length - 1]
            : filePath
        const albumName = splitFilePath?.[1]

        if (splitFilePath?.[0] !== ALBUM_COLLECTION) {
            log('Photo not part of albums! Gracefull exiting delete process.')
            return null
        }

        // check if the deleted file is a thumbnail
        if (fileName?.startsWith(THUMBNAIL_PREFIX)) {
            log('File is a thumbnail. Gracefully exiting delete process.')
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

        // delete the thumbnail
        const thumbnailFileName = `${THUMBNAIL_PREFIX}${fileName}`
        const thumbnailFilePath = `${ALBUM_COLLECTION}/${albumName}/${THUMBNAILS_FOLDER}/${thumbnailFileName}`
        const thumbnailFile = getStorageAdmin()
            .bucket(object.bucket)
            .file(thumbnailFilePath)
        thumbnailFile.delete()
        log('Successfully deleted thumbnail:', thumbnailFileName)
        return true
    })
