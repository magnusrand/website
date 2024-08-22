import React, { useState } from 'react'

import {
    deleteImageFromStorage,
    updatePhotoData,
} from '../../firebase/firebase-firestore'
import { PhotoData } from '../../types'
import { TextArea, TextField, Label } from '../Form/Text'
import { Button } from '../Buttons/Button'

import './editPhotoDataCard.css'

const EditPhotoDataCard = ({
    photo,
    albumName,
}: {
    photo: PhotoData
    albumName: string
}) => {
    const [photoTitle, setPhotoTitle] = useState<string>(photo.title ?? '')
    const [photoDescription, setPhotoDescription] = useState<string>(
        photo.description ?? '',
    )

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
            <div className="edit-photo-data-card__buttons">
                <Button
                    onClick={() =>
                        updatePhotoData(photo.documentRef, {
                            title: photoTitle,
                            description: photoDescription,
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
                                albumName,
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
