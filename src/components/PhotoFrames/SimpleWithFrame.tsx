import React from 'react'

import classNames from 'classnames'

import { PhotoData } from '../../types'

import './simpleWithFrame.css'

export const SimpleWithFrame = ({ photo }: { photo: PhotoData }) => (
    <div
        key={photo.fileName}
        className={classNames('simple-with-frame__photo-wrapper')}
    >
        <div className="simple-with-frame__photo-wrapper__image-frame">
            <img
                className="simple-with-frame__photo-wrapper__image"
                src={photo.imageUrl}
                alt={photo.fileName}
            />
        </div>
        <div className="simple-with-frame__photo-wrapper__caption">
            {photo.title ? (
                <span className="simple-with-frame__photo-wrapper__caption__heading type-garamond-bold ">
                    {photo.title} –
                </span>
            ) : (
                <></>
            )}
            {` ${photo.description ?? ''}`}
        </div>
    </div>
)
