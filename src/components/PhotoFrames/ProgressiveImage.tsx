import React from 'react'

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

    React.useEffect(() => {
        // TODO this needs to implement functionality to
        // delay loading untill image is close to be scrolled into view
        const imageToLoad = new Image()
        imageToLoad.src = src
        imageToLoad.onload = function () {
            setImageSrc(src)
            setImageIsLoading(false)
            imageRef.current?.style.setProperty(
                '--image-height',
                // @ts-expect-error height does indeed exist
                this.height + 'px',
            )
            // @ts-expect-error height and width does indeed exist
            if (this.width / this.height >= 2.7)
                imageRef.current &&
                    imageRef.current.classList.add('progressive-img--ultrawide')
        }
    }, [src])

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
