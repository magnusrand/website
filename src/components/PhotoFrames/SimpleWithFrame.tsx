import React from 'react'

import classNames from 'classnames'

import {
    IoMdStopwatch,
    IoMdAperture,
    IoMdInformationCircleOutline,
} from 'react-icons/io'

import { MdIso } from 'react-icons/md'

import { PhotoData } from '../../types'

import { getAperture, getISO, getShutterSpeedFraction } from '../utils'
import { IconButton } from '../Buttons/IconButton'

import './simpleWithFrame.css'

export const SimpleWithFrame = ({
    photo,
    onClick,
}: {
    photo: PhotoData
    onClick: () => void
}) => {
    const [showMeta, setShowMeta] = React.useState(false)

    const cameraName = ` ${
        photo.metaData?.Make !== photo.metaData?.Model?.split(' ')[0]
            ? `${photo.metaData?.Make} `
            : ''
    }${photo.metaData?.Model}`

    return (
        <div
            key={photo.fileName}
            className={classNames([
                'photo',
                'simple-with-frame__photo-wrapper',
            ])}
        >
            <img
                className="simple-with-frame__photo-wrapper__image"
                src={photo.imageUrl}
                alt={photo.fileName}
                onClick={onClick}
            />
            <div className="simple-with-frame__photo-wrapper__caption">
                <p className="simple-with-frame__photo-wrapper__caption__description">
                    {photo.title ? (
                        <span className="simple-with-frame__photo-wrapper__caption__description__heading type-garamond-bold ">
                            {photo.title} –
                        </span>
                    ) : (
                        <></>
                    )}
                    {` ${photo.description ?? ''}`}
                </p>
                {showMeta ? (
                    <p className="simple-with-frame__photo-wrapper__caption__meta">
                        <span>
                            kamera:
                            <span className="type-sourcesans-italic">
                                {cameraName}
                            </span>
                        </span>
                        <span>
                            objektiv:
                            <span className="type-sourcesans-italic">{`(${photo.metaData?.FocalLength}mm) ${photo.metaData?.LensModel}`}</span>
                        </span>
                        <span className="simple-with-frame__photo-wrapper__caption__meta__holy-triangle">
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
                        className="simple-with-frame__photo-wrapper__caption__show-meta-button"
                    >
                        <IoMdInformationCircleOutline />
                    </IconButton>
                )}
            </div>
        </div>
    )
}
