import React, { useEffect, useState } from 'react'

import { getAlbums } from '../../../firebase/firebase-firestore'
import { AlbumData } from '../../../types'

import './albumsPage.css'

const AlbumsPage = () => {
    const [albums, setAlbums] = useState<AlbumData[]>([])
    useEffect(() => {
        const getPhotosForCurrentPage = async () => {
            const albumData = await getAlbums()
            console.log('Got ', albumData.length, ' albums')
            setAlbums(photoData ?? [])
        }
        getPhotosForCurrentPage()
    }, [])

    return <h1>Under construction. {albums.length}</h1>
}

export default AlbumsPage
