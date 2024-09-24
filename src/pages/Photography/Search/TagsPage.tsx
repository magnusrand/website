import React, { useEffect, useState } from 'react'

import MainNavBar from '../../../components/NavBar/MainNavBar'
import { getAllPhotoTags } from '../../../firebase/firebase-firestore'

import './tagsPage.css'

export const TagsPage = () => {
    const [tags, setTags] = useState<string[]>([])
    useEffect(() => {
        const getAllTags = async () => {
            const albumData = await getAllPhotoTags()
            setTags(albumData ?? [])
        }
        getAllTags()
    }, [])

    return (
        <div className="main-grid tags-page">
            <MainNavBar />
            <p>Tags: {tags}</p>
        </div>
    )
}
