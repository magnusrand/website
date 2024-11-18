import React from 'react'

import classNames from 'classnames'

import { IoMdStopwatch, IoMdAperture } from 'react-icons/io'

import { MdCameraAlt, MdIso } from 'react-icons/md'

import { PhotoData } from '../../types'

import { getAperture, getISO, getShutterSpeedFraction } from '../utils'

import { ProgressiveImage } from './ProgressiveImage'

import './StoryFrame.css'

export const StoryFrame = ({
    photo,
    onClick,
    className,
    focusable,
}: {
    photo: PhotoData
    onClick: () => void
    className?: string
    focusable?: boolean
}) => {
    const cameraName = ` ${
        photo.metaData?.Make !== photo.metaData?.Model?.split(' ')[0]
            ? `${photo.metaData?.Make} `
            : ''
    }${photo.metaData?.Model}`

    return (
        <section
            id={photo.fileName.split('.')[0]}
            key={photo.fileName}
            className={classNames(className, ['photo', 'story-frame'], {
                'story-frame--portrait':
                    photo.metaData?.orientation === 'portrait',
                'story-frame--no-description': !(
                    photo.title || photo.description
                ),
            })}
        >
            <div className="story-frame__content">
                <ProgressiveImage
                    className="story-frame__image"
                    src={photo.imageUrl}
                    placeholderSrc={photo.thumbnailUrl}
                    alt={photo.fileName}
                    onClick={onClick}
                    focusable={focusable}
                />
                <div className="story-frame__text">
                    <h2 className="story-frame__text__heading type-garamond-bold">
                        {photo.title}
                    </h2>
                    <small className="story-frame__text__meta">
                        <IoMdAperture />
                        {getAperture(photo?.metaData?.FNumber)}
                        <IoMdStopwatch style={{ marginLeft: '0.5rem' }} />
                        {getShutterSpeedFraction(photo?.metaData?.ExposureTime)}
                        <MdIso style={{ marginLeft: '0.5rem' }} />
                        {getISO(photo?.metaData?.ISO)}
                        <MdCameraAlt style={{ marginLeft: '0.5rem' }} />
                        {cameraName}
                    </small>
                    <p className="story-frame__text__description">
                        {photo.description}
                    </p>
                </div>
            </div>
        </section>
    )
}
