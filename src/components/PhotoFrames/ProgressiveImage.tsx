import React from 'react'
import { getImage } from 'src/utils/imageCache'

import './ProgressiveImage.css'

type ProgressiveImageProps = {
    src: string
    placeholderSrc?: string
    alt?: string
    className?: string
    focusable?: boolean
    onClick?: () => void
} & React.ImgHTMLAttributes<HTMLImageElement>

export const ProgressiveImage = ({
    src,
    placeholderSrc,
    alt,
    className,
    focusable,
    ...rest
}: ProgressiveImageProps) => {
    const [imageSrc, setImageSrc] = React.useState(placeholderSrc)
    const [imageIsLoading, setImageIsLoading] = React.useState(true)
    const imageRef = React.useRef<HTMLImageElement>(null)

    React.useEffect(
        function loadImageWithCache() {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            loadImage()
                            // Stop observing the image once it is loaded
                            observer.unobserve(entry.target)
                        }
                    })
                },
                { rootMargin: '200px' },
            )

            async function loadImage() {
                setImageIsLoading(true)
                try {
                    const image = await getImage(src)
                    setImageSrc(image.src)

                    imageRef.current?.style.setProperty(
                        '--image-height',
                        image.height + 'px',
                    )
                    if (image.width / image.height >= 2.7)
                        imageRef.current &&
                            imageRef.current.classList.add(
                                'progressive-img--ultrawide',
                            )
                } catch (error) {
                    console.error(error)
                }
                setImageIsLoading(false)
            }

            if (imageRef.current) {
                observer.observe(imageRef.current)
            }

            return () => observer.disconnect()
        },
        [src],
    )

    React.useEffect(() => {
        const currentRef = imageRef?.current
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key == ' ' || e.key == 'Enter') rest.onClick?.()
        }
        currentRef?.addEventListener('keydown', handleKeyDown)
        return () => currentRef?.removeEventListener('keydown', handleKeyDown)
    }, [rest])

    const blankImgSrc =
        'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='

    return (
        <img
            ref={imageRef}
            src={imageSrc ?? blankImgSrc}
            alt={alt}
            className={
                'progressive-img ' +
                `${imageIsLoading ? 'progressive-img--loading ' : ' '}` +
                className
            }
            loading="lazy"
            tabIndex={focusable ? 0 : undefined}
            {...rest}
        />
    )
}
