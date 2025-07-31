import React, { useEffect, useRef, useState } from 'react'

import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { MdArrowUpward } from 'react-icons/md'

import { PhotoData } from 'src/types'
import {
    getAllPhotoTags,
    getPhotosByTag,
} from 'src/firebase/firebase-firestore'
import { getFilenameForUrl } from 'src/firebase/utils'

import { TagGroup, Tag } from '@components/Tags'
import { MainNavBar } from '@components/NavBar/MainNavBar'
import { ProgressiveImage } from '@components/PhotoFrames/ProgressiveImage'
import { FullscreenOverlay } from '@components/PhotoFrames/FullscreenOverlay/FullscreenOverlay'
import { IconButton } from '@components/Buttons/IconButton'

import './tagsPage.css'

export const TagsPage = () => {
    const [tags, setTags] = useState<string[]>([])
    const [photos, setPhotos] = useState<PhotoData[]>([])
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const params = useParams()
    const _currentTag = searchParams.get('etikett')

    const tagsRef = useRef<HTMLFieldSetElement>(null)

    const fullscreenPhotoName = params.photo?.toLowerCase()

    useEffect(() => {
        const getAllTags = async () => {
            const _tags = await getAllPhotoTags()
            setTags(_tags ?? [])
        }
        getAllTags()
    }, [])

    useEffect(() => {
        const getPhotosForTag = async () => {
            const _photos = await getPhotosByTag(_currentTag)
            setPhotos(_photos ?? [])
        }
        _currentTag !== null && getPhotosForTag()
    }, [_currentTag])

    /** Hook to keep fullscreen image and page scroll in sync */
    useEffect(() => {
        if (fullscreenPhotoName && photos.length > 0) {
            const photoElementInGrid =
                document.getElementById(fullscreenPhotoName)
            setTimeout(() => {
                photoElementInGrid?.scrollIntoView({
                    block: 'center',
                })
            }, 100) // Delay to ensure the element is rendered
        }
    }, [photos, fullscreenPhotoName])

    const photosFirstHalf = photos?.filter((photo, index) => index % 2 === 0)
    const photosLastHalf = photos?.filter((photo, index) => index % 2 === 1)

    const searchParam = _currentTag ? `?etikett=${_currentTag}` : ''

    return (
        <div className="main-grid tags-page">
            <MainNavBar />
            <main className="">
                <TagGroup
                    className={`tags-page__tag-group${
                        photos.length === 0
                            ? ' tags-page__tag-group--unselected'
                            : ''
                    }`}
                    ref={tagsRef}
                >
                    {tags.map((tag) => (
                        <Tag
                            key={tag}
                            name="photo-tags"
                            onClick={() =>
                                setSearchParams({
                                    etikett: _currentTag !== tag ? tag : '',
                                })
                            }
                            // @ts-expect-error test
                            checked={tag === searchParams.get('etikett')}
                        >
                            {tag}
                        </Tag>
                    ))}
                </TagGroup>
                {/* Photos are split into two columns to allow for moasic layout 
                    with even distribution of elements. */}
                <div className="photo-element__container first-column">
                    {photosFirstHalf?.map((photo) => (
                        <ProgressiveImage
                            src={photo.imageUrl}
                            placeholderSrc={photo.thumbnailUrl}
                            focusable={fullscreenPhotoName === undefined}
                            onClick={() =>
                                navigate(
                                    `/foto/etiketter/${getFilenameForUrl(
                                        photo.fileName,
                                    )}${searchParam}`,
                                )
                            }
                            className="photo-element"
                            key={photo.documentRef.id}
                            id={getFilenameForUrl(photo.fileName)}
                        />
                    ))}
                </div>
                <div className="photo-element__container second-column">
                    {photosLastHalf.map((photo) => (
                        <ProgressiveImage
                            src={photo.imageUrl}
                            placeholderSrc={photo.thumbnailUrl}
                            focusable={fullscreenPhotoName === undefined}
                            onClick={() =>
                                navigate(
                                    `/foto/etiketter/${getFilenameForUrl(
                                        photo.fileName,
                                    )}${searchParam}`,
                                )
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
            <FullscreenOverlay
                photoUrls={photos.map((photo) => ({
                    photo: photo.imageUrl,
                    placeholder: photo.thumbnailUrl,
                    photoName: getFilenameForUrl(photo.fileName),
                }))}
                currentPhoto={fullscreenPhotoName}
                onNavigate={(nextPhotoName) => {
                    if (nextPhotoName === null)
                        return navigate(`/foto/etiketter${searchParam}`)

                    navigate(`/foto/etiketter/${nextPhotoName}${searchParam}`)
                }}
            />
        </div>
    )
}
