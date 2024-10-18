import React, { useEffect, useRef, useState } from 'react'

import { MdArrowUpward } from 'react-icons/md'

import { PhotoData } from '../../../types'

import { TagGroup, Tag } from '../../../components/Tags'
import MainNavBar from '../../../components/NavBar/MainNavBar'
import { ProgressiveImage } from '../../../components/PhotoFrames/ProgressiveImage'
import { FullscreenOverlay } from '../../../components/PhotoFrames/FullscreenOverlay/FullscreenOverlay'
import { IconButton } from '../../../components/Buttons/IconButton'

import {
    getAllPhotoTags,
    getPhotosByTag,
} from '../../../firebase/firebase-firestore'

import './tagsPage.css'

export const TagsPage = () => {
    const [tags, setTags] = useState<string[]>([])
    const [selectedTag, setSelectedTag] = useState<string>()
    const [photos, setPhotos] = useState<PhotoData[]>([])
    const tagsRef = useRef<HTMLFieldSetElement>(null)
    const [currentFullscreenIndex, setCurrentFullscreenIndex] = useState<
        number | null
    >(null)

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
        selectedTag !== undefined && getPhotosForTag()
    }, [selectedTag])

    return (
        <div className="main-grid tags-page">
            <MainNavBar />
            <main className="">
                <TagGroup className="tags-page__tag-group" ref={tagsRef}>
                    {tags.map((tag) => (
                        <Tag
                            key={tag}
                            name="photo-tags"
                            onClick={() => setSelectedTag(tag)}
                        >
                            {tag}
                        </Tag>
                    ))}
                </TagGroup>
                <FullscreenOverlay
                    photoUrls={photos.map((photo) => ({
                        photo: photo.imageUrl,
                        placeholder: photo.thumbnailUrl,
                    }))}
                    currentIndex={currentFullscreenIndex}
                    onIndexChange={setCurrentFullscreenIndex}
                />
                {photos?.map((photo, index) => (
                    <ProgressiveImage
                        src={photo.imageUrl}
                        placeholderSrc={photo.thumbnailUrl}
                        focusable={currentFullscreenIndex === null}
                        onClick={() => setCurrentFullscreenIndex(index)}
                        className="photo-element"
                        key={photo.documentRef.id}
                    />
                ))}
                {photos.length > 0 && (
                    <IconButton
                        className="scroll-to-top-button"
                        onClick={() => tagsRef.current?.scrollIntoView(true)}
                    >
                        <MdArrowUpward />
                    </IconButton>
                )}
            </main>
        </div>
    )
}
