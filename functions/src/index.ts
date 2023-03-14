import { https, logger } from 'firebase-functions'
import { initializeApp } from 'firebase-admin/app'
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

export const createPhotosInAlbum = https.onRequest(
    // @ts-ignore
    async (request, response) => {
        cors({ origin: true })(request, response, async () => {
            const parameters = request.query
            const link = parameters.link as string
            const collectionName = parameters.album as string | undefined
            const name = parameters.name as string | undefined

            let rejectedPhotos = 0

            const photoLinkRegex = /gl\/(.*)/

            const albumId = link?.match(photoLinkRegex)?.[1]
            if (!albumId) {
                logger.error('Wrong link format')
            }

            try {
                const content = await axios.get<string>(
                    // `https://photos.app.goo.gl/${albumId}`,
                    link,
                )
                // const content = await fetchResponse.text()
                const links = extractPhotoLinksFromContent(content.data)
                logger.info('Following links found', links)

                const albumSnapshot = await getFirestore()
                    .collection(ALBUM_COLLECTION)
                    .where('name', '==', collectionName)
                    .get()

                logger.info('✓ Data and firestore snapshot fetched')

                let docId = ''

                if (albumSnapshot.empty) {
                    const docRef = await getFirestore()
                        .collection(ALBUM_COLLECTION)
                        .add({
                            name: collectionName,
                            numberOfPhotos: 'unknown',
                            coverPhoto: 'unknown',
                        })

                    docId = docRef.id
                } else {
                    docId = albumSnapshot.docs[0].id
                }

                logger.info('✓ New album created in firestore')

                links.forEach(async function (
                    photoLink: string,
                ): Promise<void> {
                    const response = await axios.get(photoLink, {
                        responseType: 'arraybuffer',
                    })
                    const buffer = Buffer.from(response.data, 'utf-8')

                    new ExifImage({ image: buffer }, async function (
                        error: any,
                        exifData: any,
                    ) {
                        if (error) logger.info('Error: ' + error.message)
                        else {
                            const artist =
                                (exifData.image.Artist as string) ?? 'unknown'
                            if (artist !== 'Magnus Rand') {
                                rejectedPhotos += 1
                                logger.debug(
                                    'photo was rejected, atrist was',
                                    artist,
                                )
                                return
                            }

                            const imageWidth: number | 'unknown' =
                                (exifData.exif.ExifImageWidth as number) ??
                                'unknown'
                            const imageHeight: number | 'unknown' =
                                (exifData.exif.ExifImageHeight as number) ??
                                'unknown'

                            const imageOrientation:
                                | 'unknown'
                                | 'portrait'
                                | 'landscape' =
                                imageHeight >= imageWidth
                                    ? 'portrait'
                                    : 'landscape'
                            const aspectRatio: number = imageWidth / imageHeight

                            // logger.debug('exif', exifData) // Do something with your data!

                            const photoFileNameRegex =
                                /"(([a-åA-Å0-9\-_]*)\(([0-9]*)\))/

                            const photoFileName = (
                                response.headers[
                                    'content-disposition'
                                ] as string
                            ).match(photoFileNameRegex)

                            const photoName: string | undefined =
                                photoFileName?.[2]
                            const photoDate: number = parseInt(
                                photoFileName?.[3] ?? '-1',
                            )

                            // const photWidth: number = response.headers;
                            // @ts-ignore
                            await getFirestore()
                                .collection(
                                    `${ALBUM_COLLECTION}/${docId}/photos`,
                                )
                                .add({
                                    link: photoLink,
                                    name: photoName ?? name ?? 'unknown',
                                    photoDate: photoDate,
                                    meta: {
                                        aspectRatio: aspectRatio,
                                        orientation: imageOrientation,
                                    },
                                })
                        }
                    })
                })

                logger.info('✓ Photo links added to firestore')
                response
                    .status(200)
                    .send(
                        `Success! ${
                            links.length
                        } photos added to album "${collectionName}". ${
                            rejectedPhotos > 0
                                ? rejectedPhotos + ' photos were rejected.'
                                : ''
                        }`,
                    )
            } catch (e) {
                logger.error('FEIL!', e)
                response
                    .status(500)
                    .send('An error occurred while adding the photos')
            }
        })
    },
)


/* FRA CHATGPT3 MED GOOGLE API

// Load the Google Photos API client library
gapi.load('client:auth2', function() {
  gapi.auth2.init({
    // Initialize the Google Photos API with your API key and client ID
    apiKey: 'YOUR_API_KEY',
    clientId: 'YOUR_CLIENT_ID',
    scope: 'https://www.googleapis.com/auth/photoslibrary.readonly'
  }).then(function() {
    // Authenticate the user and fetch the list of photos in the album
    return gapi.auth2.getAuthInstance().signIn();
  }).then(function() {
    // Replace 'ABC1234567890' with the album ID
    return gapi.client.photoslibrary.mediaItems.search({
      albumId: 'ABC1234567890',
      pageSize: 100
    });
  }).then(function(response) {
    // Loop through each photo and fetch the photo URL and EXIF metadata
    response.result.mediaItems.forEach(function(mediaItem) {
      var photoUrl = mediaItem.baseUrl;
      var photoMetadata = gapi.client.photoslibrary.mediaItems.get({
        mediaItemId: mediaItem.id,
        fields: 'id,mediaMetadata'
      });
      // Do something with the photo URL and metadata
      console.log(photoUrl, photoMetadata);
    });
  });
});



*/
