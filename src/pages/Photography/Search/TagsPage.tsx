import React, { useEffect, useState } from 'react'

import MainNavBar from '../../../components/NavBar/MainNavBar'
import { Tag } from '../../../components/Tags/Tag'
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
            <main className="">
                <fieldset className="tags-page__tags-list">
                    {tags.map((tag) => (
                        <Tag key={tag} name="photo-tags">
                            {tag}
                        </Tag>
                    ))}
                </fieldset>
            </main>
        </div>
    )
}
