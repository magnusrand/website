import React from 'react'

import classNames from 'classnames'

import {
    IoMdStopwatch,
    IoMdAperture,
    IoMdInformationCircleOutline,
} from 'react-icons/io'

import { MdCameraAlt, MdIso } from 'react-icons/md'
import { FaMartiniGlass } from 'react-icons/fa6'

import { PhotoData } from 'src/types'

import { getAperture, getISO, getShutterSpeedFraction } from '../utils'

import { IconButton } from '../Buttons/IconButton'

import { ProgressiveImage } from './ProgressiveImage'

import './simpleFrame.css'

export const SimpleFrame = ({
    photo,
    onClick,
    className,
    focusable,
    id = photo.fileName.split('.')[0],
}: {
    photo: PhotoData
    onClick: () => void
    className?: string
    focusable?: boolean
    id?: string
}) => {
    const [showMeta, setShowMeta] = React.useState(false)

    const cameraName = ` ${
        photo.metaData?.Make !== photo.metaData?.Model?.split(' ')[0]
            ? `${photo.metaData?.Make} `
            : ''
    }${photo.metaData?.Model}`
    const lens = ` (${photo.metaData?.FocalLength}mm) ${photo.metaData?.LensModel}`

    return (
        <section
            id={photo.fileName.split('.')[0]}
            key={photo.fileName}
            className={classNames(
                className,
                ['photo', 'simple-frame__photo-wrapper'],
                {
                    'simple-frame__photo-wrapper--portrait':
                        photo.metaData?.orientation === 'portrait',
                    'simple-frame__photo-wrapper--no-description': !(
                        photo.title || photo.description
                    ),
                },
            )}
        >
            <ProgressiveImage
                className="simple-frame__photo-wrapper__image"
                src={photo.imageUrl}
                placeholderSrc={photo.thumbnailUrl}
                alt={photo.fileName}
                onClick={onClick}
                focusable={focusable}
                id={id}
            />
            <div className="simple-frame__photo-wrapper__caption">
                <p className="simple-frame__photo-wrapper__caption__description">
                    {photo.title && (
                        <span className="simple-frame__photo-wrapper__caption__description__heading type-garamond-bold ">
                            {photo.title}
                        </span>
                    )}
                    {`${photo.title && photo.description ? ' – ' : ''}${
                        photo.description ?? ''
                    }`}
                </p>
                {showMeta ? (
                    <p className="simple-frame__photo-wrapper__caption__meta">
                        <span>
                            <MdCameraAlt />
                            <span className="type-sourcesans-italic">
                                {cameraName}
                            </span>
                        </span>
                        <span>
                            <FaMartiniGlass />
                            <span className="type-sourcesans-italic">
                                {lens}
                            </span>
                        </span>
                        <span className="simple-frame__photo-wrapper__caption__meta__holy-triangle">
                            <span>
                                <IoMdAperture />
                                {getAperture(photo?.metaData?.FNumber)}
                            </span>
                            <span>
                                <IoMdStopwatch />
                                {getShutterSpeedFraction(
                                    photo?.metaData?.ExposureTime,
                                )}
                            </span>
                            <span>
                                <MdIso />
                                {getISO(photo?.metaData?.ISO)}
                            </span>
                        </span>
                    </p>
                ) : (
                    <IconButton
                        onClick={() => setShowMeta(true)}
                        className="simple-frame__photo-wrapper__caption__show-meta-button"
                    >
                        <IoMdInformationCircleOutline />
                    </IconButton>
                )}
            </div>
        </section>
    )
}
