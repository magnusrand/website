import React, { useState } from 'react'

import { updatePhotoData } from '../../firebase/firebase-firestore'
import { PhotoData } from '../../types'
import { ProgressiveImage } from '../PhotoFrames/ProgressiveImage'

import './editPhotoDataCard.css'

const EditPhotoDataCard = ({ photo }: { photo: PhotoData }) => {
    const [photoTitle, setPhotoTitle] = useState<string>(photo.title ?? '')
    const [photoDescription, setPhotoDescription] = useState<string>(
        photo.description ?? '',
    )

    return (
        <div className="edit-photo-data-card">
            <ProgressiveImage
                className="edit-photo-data-card__image"
                src={photo.imageUrl}
                placeholderSrc={photo.thumbnailUrl}
            />
            <h2>{photo.fileName}</h2>
            <div className="edit-photo-data-card__input">
                <label htmlFor="photoTitle">Title</label>
                <input
                    type="text"
                    id="photoTitle"
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                />
            </div>
            <div className="edit-photo-data-card__input">
                <label htmlFor="photoDescription">Description</label>
                <textarea
                    id="photoDescription"
                    value={photoDescription}
                    onChange={(e) => setPhotoDescription(e.target.value)}
                />
            </div>
            <button
                type="button"
                onClick={() =>
                    updatePhotoData(photo.documentRef, {
                        title: photoTitle,
                        description: photoDescription,
                    })
                }
            >
                Oppdater
            </button>
        </div>
    )
}

export default EditPhotoDataCard
