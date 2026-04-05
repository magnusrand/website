import React from 'react'
import { getImage } from 'src/utils/imageCache'

import './ProgressiveImage.css'

type ProgressiveImageProps = {
    src?: string
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
    const [imageSrc, setImageSrc] = React.useState<string>()
    const [imageIsLoading, setImageIsLoading] = React.useState(true)
    const [imageInView, setImageInView] = React.useState(false)
    const imageRef = React.useRef<HTMLImageElement>(null)

    React.useEffect(
        function setThumbnail() {
            setImageSrc(placeholderSrc ?? src)
        },
        [placeholderSrc, src],
    )

    React.useEffect(
        function loadImageWithCache() {
            const observerLoading = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            loadImage()
                            // Stop observing the image once it is loaded
                            observerLoading.unobserve(entry.target)
                        }
                    })
                },
                { rootMargin: '300px' },
            )

            async function loadImage() {
                try {
                    const image = await getImage(src)
                    if (!image) return
                    setImageSrc(image.src)
                    imageRef.current?.setAttribute('data-image-loaded', 'true')

                    imageRef.current?.style.setProperty(
                        '--image-height',
                        image.height + 'px',
                    )
                    if (image.width / image.height >= 2.7)
                        imageRef.current?.classList.add(
                            'progressive-img--ultrawide',
                        )
                } catch (error) {
                    console.error(error)
                }
            }

            if (imageRef.current) observerLoading.observe(imageRef.current)

            return () => observerLoading.disconnect()
        },
        [src],
    )
    React.useEffect(function addFadeInAnimation() {
        const observerVisible = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (imageRef.current && entry.isIntersecting) {
                        setImageInView(true)
                        // Stop observing the image once it is visible
                        observerVisible.unobserve(entry.target)
                    }
                })
            },
            { rootMargin: '0px' },
        )

        if (imageRef.current) observerVisible.observe(imageRef.current)

        return () => observerVisible.disconnect()
    }, [])

    React.useEffect(() => {
        const currentRef = imageRef?.current
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key == ' ' || e.key == 'Enter') rest.onClick?.()
        }
        currentRef?.addEventListener('keydown', handleKeyDown)
        return () => currentRef?.removeEventListener('keydown', handleKeyDown)
    }, [rest])

    React.useEffect(() => {
        const currentRef = imageRef?.current
        setImageIsLoading(true)
        if (currentRef) {
            currentRef.onload = function () {
                setImageIsLoading(false)
            }
        }
    }, [])

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
                `${!imageIsLoading && imageInView ? 'animation-in ' : ' '}` +
                className
            }
            loading="lazy"
            tabIndex={focusable ? 0 : undefined}
            {...rest}
        />
    )
}
