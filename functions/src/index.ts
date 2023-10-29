import { storage } from 'firebase-functions'
import { initializeApp } from 'firebase-admin/app'
import { getStorage as getStorageAdmin } from 'firebase-admin/storage'
import { getFirestore } from 'firebase-admin/firestore'

import * as exifr from 'exifr'

initializeApp()

const ALBUM_COLLECTION = 'albums'
const PHOTOS_COLLECTION = 'photos'

export const createDocumentForUploadedPhotoInAlbum = storage
    .object()
    .onFinalize(async (object) => {
        const filePath = object.name as string
        const fileName = filePath?.includes('/')
            ? filePath?.split('/')[1]
            : filePath
        const fileBucket = object.bucket

        const albumName = filePath?.includes('/')
            ? filePath?.split('/')[0]
            : 'none'

        console.log('filePath is', filePath)

        // Check if the uploaded file is an image
        if (!filePath?.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/i)) {
            console.log('File is not an image')
            return null
        }

        // Get the download URL for the uploaded file
        const bucket = getStorageAdmin().bucket(fileBucket)
        const file = bucket.file(filePath)
        const _file = await file.download().then((data) => data[0])
        const publicUrl = await file.publicUrl()
        const meta = await exifr
            .parse(_file, META_DATA_FIELDS)
            .then((output) => output)
            .catch((e) => {
                console.log('Error parsing EXIF data:', e)
                return {}
            })

        const newPhotoData = {
            title: '',
            description: '',
            imageUrl: publicUrl,
            fileName: fileName,
            metaData: meta,
        }

        const albumQuery = getFirestore()
            .collection(ALBUM_COLLECTION)
            .where('name', '==', albumName)
        const querySnapshot = await albumQuery.get()
        const albumAlreadyExists = !querySnapshot.empty

        if (albumAlreadyExists) {
            // Update the existing album with the new image
            const albumRef = querySnapshot.docs[0].ref
            albumRef.collection(PHOTOS_COLLECTION).add(newPhotoData)

            const numberOfPhotosInAlbum =
                (
                    await albumRef.collection(PHOTOS_COLLECTION).count().get()
                ).data().count + 1

            await albumRef.update({
                numberOfPhotos: numberOfPhotosInAlbum,
            })

            console.log('Album', albumName, 'updated with URL:', publicUrl)
        } else {
            // Create a new document with the image
            const albumRef = getFirestore().collection(ALBUM_COLLECTION).doc()
            await albumRef.set({ name: albumName, numberOfPhotos: 1 })

            const photoRef = albumRef.collection(PHOTOS_COLLECTION).doc()
            await photoRef.set(newPhotoData)

            console.log('Album', albumName, 'created with URL:', publicUrl)
        }

        return null
    })

const META_DATA_FIELDS = [
    'Make',
    'Model',
    'XResolution',
    'YResolution',
    'ResolutionUnit',
    'Software',
    'ModifyDate',
    'Artist',
    'ExposureTime',
    'FNumber',
    'ExposureProgram',
    'ISO',
    'SensitivityType',
    'RecommendedExposureIndex',
    'ExifVersion',
    'DateTimeOriginal',
    'CreateDate',
    'OffsetTime',
    'ShutterSpeedValue',
    'ApertureValue',
    'ExposureCompensation',
    'MaxApertureValue',
    'MeteringMode',
    'Flash',
    'FocalLength',
    'SubSecTimeOriginal',
    'SubSecTimeDigitized',
    'ColorSpace',
    'ExifImageWidth',
    'ExifImageHeight',
    'FocalPlaneXResolution',
    'FocalPlaneYResolution',
    'FocalPlaneResolutionUnit',
    'CustomRendered',
    'ExposureMode',
    'WhiteBalance',
    'SceneCaptureType',
    'ImageUniqueID',
    'SerialNumber',
    'LensInfo',
    'LensModel',
    'LensSerialNumber',
]
