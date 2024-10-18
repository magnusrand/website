import React, { useEffect, useState } from 'react'

import MainNavBar from '../../../components/NavBar/MainNavBar'
import { Tag } from '../../../components/Tags/Tag'
import { PhotoData } from '../../../types'
import { ProgressiveImage } from '../../../components/PhotoFrames/ProgressiveImage'
import {
    getAllPhotoTags,
    getPhotosByTag,
} from '../../../firebase/firebase-firestore'

import './tagsPage.css'

export const TagsPage = () => {
    const [tags, setTags] = useState<string[]>([])
    const [selectedTag, setSelectedTag] = useState<string>()
    const [photos, setPhotos] = useState<PhotoData[]>([])

    useEffect(() => {
        const getAllTags = async () => {
            const _tags = await getAllPhotoTags()
            setTags(_tags ?? [])
        }
        getAllTags()
    }, [])

    useEffect(() => {
        const getPhotosForTag = async () => {
            const _photos = await getPhotosByTag(selectedTag)
            setPhotos(_photos ?? [])
        }
        getPhotosForTag()
    }, [selectedTag])

    return (
        <div className="main-grid tags-page">
            <MainNavBar />
            <p>Tags: {tags}</p>
            <main className="">
                <fieldset className="tags-page__tags-list">
                    {tags.map((tag) => (
                        <Tag
                            key={tag}
                            name="photo-tags"
                            onClick={() => setSelectedTag(tag)}
                        >
                            {tag}
                        </Tag>
                    ))}
                </fieldset>
                {photos?.map((photo) => (
                    <ProgressiveImage
                        key={photo.documentRef.id}
                        src={photo.imageUrl}
                        placeholderSrc={photo.thumbnailUrl}
                    />
                ))}
            </main>
        </div>
    )
}
