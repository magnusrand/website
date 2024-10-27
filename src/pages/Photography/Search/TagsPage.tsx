import React, { useEffect, useRef, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

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
    const [photos, setPhotos] = useState<PhotoData[]>([])
    const [searchParams, setSearchParams] = useSearchParams()
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
        const _currentTag = searchParams.get('etikett')

        const getPhotosForTag = async () => {
            const _photos = await getPhotosByTag(_currentTag)
            setPhotos(_photos ?? [])
        }
        _currentTag !== null && getPhotosForTag()
    }, [searchParams])

    const photosFirstHalf = photos?.filter((photo, index) => index % 2 === 0)
    const photosLastHalf = photos?.filter((photo, index) => index % 2 === 1)

    return (
        <div className="main-grid tags-page">
            <MainNavBar />
            <main className="">
                <TagGroup className="tags-page__tag-group" ref={tagsRef}>
                    {tags.map((tag) => (
                        <Tag
                            key={tag}
                            name="photo-tags"
                            onClick={() => setSearchParams({ etikett: tag })}
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
                {/* Photos are split into two columns to allow for moasic layout 
                    with even distribution of elements. */}
                <div className="photo-element__container first-column">
                    {photosFirstHalf?.map((photo, index) => (
                        <ProgressiveImage
                            src={photo.imageUrl}
                            placeholderSrc={photo.thumbnailUrl}
                            focusable={currentFullscreenIndex === null}
                            onClick={() => setCurrentFullscreenIndex(index * 2)}
                            className="photo-element"
                            key={photo.documentRef.id}
                        />
                    ))}
                </div>
                <div className="photo-element__container second-column">
                    {photosLastHalf.map((photo, index) => (
                        <ProgressiveImage
                            src={photo.imageUrl}
                            placeholderSrc={photo.thumbnailUrl}
                            focusable={currentFullscreenIndex === null}
                            onClick={() =>
                                setCurrentFullscreenIndex(index * 2 + 1)
                            }
                            className="photo-element"
                            key={photo.documentRef.id}
                        />
                    ))}
                </div>
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
