import React, { useState } from 'react'

import { MdArrowBack, MdArrowForward } from 'react-icons/md'

import { PhotoData } from 'src/types'

import { IconButton } from '@components/Buttons/IconButton'

import {
    deleteImageFromStorage,
    updatePhotoData,
} from '../../firebase/firebase-firestore'
import {
    formatDescriptionForDisplay,
    formatDescriptionForFirestore,
} from '../../firebase/utils'
import { TextArea, TextField, Label } from '../Form/Text'
import { Button } from '../Buttons/Button'

import './editPhotoDataCard.css'

const EditPhotoDataCard = ({
    photo,
    albumName,
    allPhotoTags,
    index,
    maxIndex,
    onPositionChange,
}: {
    photo: PhotoData
    albumName: string
    allPhotoTags: string[]
    index?: number
    maxIndex?: number
    onPositionChange: (operation: 'increase' | 'decrease' | number) => void
}) => {
    const [photoTitle, setPhotoTitle] = useState<string>(photo.title ?? '')
    const [photoDescription, setPhotoDescription] = useState<string>(
        formatDescriptionForDisplay(photo.description) ?? '',
    )
    const [photoTags, setPhotoTags] = useState<string[]>(photo?.tags ?? [])
    const [photoDisplayMode, setPhotoDisplayMode] = useState<
        undefined | '' | 'story' | 'normal'
    >(photo?.displayMode ?? '')

    return (
        <div className="edit-photo-data-card">
            <img
                className="edit-photo-data-card__image"
                src={photo.thumbnailUrl}
            />
            <h2 className="edit-photo-data-card__photo-name">
                {photo.fileName}
            </h2>
            <div className="edit-photo-data-card__input">
                <Label htmlFor="photoTitle">Title</Label>
                <TextField
                    id="photoTitle"
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                />
            </div>
            <div className="edit-photo-data-card__input">
                <Label htmlFor="photoDescription">Description</Label>
                <TextArea
                    id="photoDescription"
                    value={photoDescription}
                    onChange={(e) => setPhotoDescription(e.target.value)}
                />
            </div>
            <div className="edit-photo-data-card__input">
                <Label htmlFor="photoTags">Etiketter</Label>
                <select
                    name="tag"
                    id="tag-select"
                    onChange={(e) => {
                        if (e.target.value === '-') return
                        if (photoTags.includes(e.target.value)) {
                            setPhotoTags(
                                photoTags.filter(
                                    (tag) => tag !== e.target.value,
                                ),
                            )
                            return
                        }
                        setPhotoTags([...photoTags, e.target.value])
                    }}
                    value="velg etikett …"
                >
                    <option key="nothing" value="-">
                        velg etikett …
                    </option>
                    {allPhotoTags.map((tag) => (
                        <option key={tag} value={tag}>
                            {photoTags.includes(tag) ? '✔️ ' : ''}
                            {tag}
                        </option>
                    ))}
                </select>
                <TextField
                    id="photoTags"
                    value={photoTags.join(', ')}
                    onChange={(e) => setPhotoTags(e.target.value.split(', '))}
                />
            </div>
            <div className="edit-photo-data-card__input">
                <Label htmlFor="photoDisplayMode">Visningsmodus</Label>
                <TextField
                    id="photoDisplayMode"
                    value={photoDisplayMode ?? ''}
                    // @ts-expect-error type checking not implemented yet
                    onChange={(e) => setPhotoDisplayMode(e.target.value)}
                />
            </div>
            {index !== undefined && (
                <div className="edit-photo-data-card__order">
                    {index > 0 && (
                        <IconButton>
                            <MdArrowBack
                                onClick={() => onPositionChange('increase')}
                            />
                        </IconButton>
                    )}
                    <div className="edit-photo-data-card__input">
                        <Label htmlFor="photoIndex">Index</Label>
                        <TextField
                            id="photoIndex"
                            defaultValue={index.toString()}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const newIndex = parseInt(
                                        e.currentTarget.value,
                                        10,
                                    )
                                    if (newIndex < 0) return
                                    if (maxIndex && newIndex > maxIndex) return
                                    onPositionChange(newIndex)
                                }
                                if (e.key === 'Escape') {
                                    e.currentTarget.value = index.toString()
                                }
                            }}
                        />
                    </div>
                    {index < (maxIndex ?? index + 1) && (
                        <IconButton>
                            <MdArrowForward
                                onClick={() => onPositionChange('decrease')}
                            />
                        </IconButton>
                    )}
                </div>
            )}
            <Button
                className="edit-photo-data-card__buttons"
                onClick={() => {
                    if (!photo.albumRef) return
                    updatePhotoData(photo.albumRef, {
                        coverPhotoUrl: photo.imageUrl,
                    })
                }}
            >
                Bruk som forsidebilde
            </Button>
            <div className="edit-photo-data-card__buttons">
                <Button
                    onClick={() =>
                        updatePhotoData(photo.documentRef, {
                            title: photoTitle,
                            description:
                                formatDescriptionForFirestore(photoDescription),
                            tags: photoTags,
                            // @ts-expect-error type checking not implemented yet
                            displayMode: photoDisplayMode,
                        })
                    }
                >
                    Oppdater
                </Button>
                <Button
                    variant="negative"
                    onClick={async () => {
                        if (
                            window.confirm(
                                `Sikker på at du vil slette ${photo.fileName}?`,
                            )
                        ) {
                            await deleteImageFromStorage({
                                albumName: albumName
                                    .replace(/\s/g, '-')
                                    .replace('+', '-'),
                                fileName: photo.fileName,
                            })
                            window.location.reload()
                        }
                    }}
                >
                    Slett
                </Button>
            </div>
        </div>
    )
}

export default EditPhotoDataCard
