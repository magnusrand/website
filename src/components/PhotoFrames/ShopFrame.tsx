import { IoMdStopwatch, IoMdAperture } from 'react-icons/io'
import { MdCameraAlt, MdIso } from 'react-icons/md'

import { PhotoData } from 'src/types'
import { getPhotoInAlbum } from '@firebase-utils/firebase-firestore'

import {
    getAperture,
    getCameraName,
    getISO,
    getShutterSpeedFraction,
} from '../utils'

import { ProgressiveImage } from './ProgressiveImage'
import './shopFrame.css'
import { useEffect, useState } from 'react'

export function ShopFrame(props: { photo: PhotoData }) {
    const [originalImage, setOriginalImage] = useState<PhotoData | null>(null)
    useEffect(function getOriginalImage() {
        async function fetchPhotoData() {
            const photoData = await getPhotoInAlbum(
                props.photo.alternativeVersion?.albumName,
                props.photo.alternativeVersion?.fileName,
            )
            // if (!photoData) return
            setOriginalImage(photoData)
            console.log('test', photoData)
        }
        fetchPhotoData()
    }, [])
    const cameraName = getCameraName(originalImage)

    return (
        <div className="shop-frame">
            <ProgressiveImage
                className="shop-frame__image"
                src={props.photo.imageUrl}
                placeholderSrc={props.photo.thumbnailUrl}
            />
            <div className="shop-frame__info">
                <h2>Bildenavn</h2>
                <small className="story-frame__text__meta">
                    <IoMdAperture />
                    {getAperture(originalImage?.metaData?.FNumber)}
                    <IoMdStopwatch style={{ marginLeft: '0.5rem' }} />
                    {getShutterSpeedFraction(
                        originalImage?.metaData?.ExposureTime,
                    )}
                    <MdIso style={{ marginLeft: '0.5rem' }} />
                    {getISO(originalImage?.metaData?.ISO)}
                    <MdCameraAlt style={{ marginLeft: '0.5rem' }} />
                    {cameraName}
                </small>
            </div>
        </div>
    )
}
