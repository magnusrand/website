import { storage } from 'firebase-functions'
import { initializeApp } from 'firebase-admin/app'
import { getStorage as getStorageAdmin } from 'firebase-admin/storage'
import { getFirestore } from 'firebase-admin/firestore'

initializeApp()

const ALBUM_COLLECTION = 'albums'
const PHOTOS_COLLECTION = 'photos'

export const createDocumentForUploadedPhotoInAlbum = storage
    .object()
    .onFinalize(;async (object) => {
        const filePath = object.name
        const fileBucket = object.bucket

        const albumName = filePath?.includes('/')
            ? filePath?.split('/')[0]
            : 'none'

        console.log('filePath is', filePath)

        // Check if the uploaded file is an image
        if (!filePath?.match(/\.(jpg|jpeg|png|gif)$/i)) {
            console.log('File is not an image')
            return null
        }

        // Get the download URL for the uploaded file
        const bucket = getStorageAdmin().bucket(fileBucket)
        const file = bucket.file(filePath)
        const publicUrl = await file.publicUrl()

        const newPhotoData = {
            imageUrl: publicUrl,
            fileName: filePath?.includes('/')
                ? filePath?.split('/')[1]
                : filePath,
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
                (await albumRef.collection(PHOTOS_COLLECTION).count().get()).data()
                    .count + 1

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
