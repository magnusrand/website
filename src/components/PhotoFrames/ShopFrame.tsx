import { useEffect, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { getPhotoInAlbum } from '@firebase-utils/firebase-firestore'

import { MetaText } from '@components/MetaText/MetaText'
import { Button } from '@components/Buttons/Button'
import { ButtonLink } from '@components/Buttons/ButtonLink'
import {
    formatDescriptionForHTML,
    getFilenameForUrl,
} from '@firebase-utils/utils'

import { PhotoData } from 'src/types'

import { ProgressiveImage } from './ProgressiveImage'

import './shopFrame.css'
import { getEmailTemplate } from '@components/utils'

export function ShopFrame({
    photo,
    className,
    ...rest
}: {
    photo: PhotoData
    className?: string
    onClick?: () => void
}) {
    const descriptionRef = useRef<HTMLParagraphElement>(null)
    const navigate = useNavigate()

    const description = formatDescriptionForHTML(photo.description)

    useEffect(() => {
        descriptionRef.current &&
            descriptionRef.current.insertAdjacentHTML('afterbegin', description)
    }, [description])
    const [originalImage, setOriginalImage] = useState<PhotoData | null>(null)

    useEffect(function getOriginalImage() {
        async function fetchPhotoData() {
            const photoData = await getPhotoInAlbum(
                photo.alternativeVersion?.albumName,
                photo.alternativeVersion?.fileName,
            )
            if (!photoData) return
            setOriginalImage(photoData)
        }
        fetchPhotoData()
    }, [])

    const originalImageFullscreenPath = (() => {
        const album = photo.alternativeVersion?.albumName
        if (!album) return
        if (album?.toLowerCase() === 'utvalgte')
            return `/foto/utvalgte/${getFilenameForUrl(photo.alternativeVersion?.fileName)}`
        return `/foto/album/${photo.alternativeVersion?.albumName.toLowerCase()}/${getFilenameForUrl(photo.alternativeVersion?.fileName)}`
    })()

    return (
        <div className={`shop-frame ${className}`}>
            <ProgressiveImage
                className="shop-frame__image"
                src={photo.imageUrl}
                placeholderSrc={photo.thumbnailUrl}
                onClick={() => {
                    const _photoName = getFilenameForUrl(
                        originalImage?.fileName,
                    )
                    navigate(`/foto/butikk/${_photoName}`)
                    rest.onClick?.()
                }}
            />
            <div className="shop-frame__info">
                <h2 className="shop-frame__photo-name">
                    {photo.title ? photo.title : 'Uten navn'}
                </h2>
                <MetaText photo={originalImage} />
                <div
                    className="shop-frame__photo-description"
                    ref={descriptionRef}
                />
                <ButtonLink
                    href={`mailto:magnus.rand+fotobutikk@gmail.com?subject=Bestilling%20av%20foto%20til%20trykk&body=${getEmailTemplate(
                        photo.title ?? 'ukjent',
                        photo.alternativeVersion?.fileName ?? 'ukjent',
                        photo.alternativeVersion?.albumName ?? 'ukjent',
                    )}`}
                    className="shop-frame__order-button"
                >
                    Bestill trykk
                </ButtonLink>
                {originalImageFullscreenPath && (
                    <ButtonLink
                        className="shop-frame__original-image-button"
                        variant="secondary"
                        to={originalImageFullscreenPath}
                    >
                        Vis bildet i album
                    </ButtonLink>
                )}
            </div>
        </div>
    )
}
