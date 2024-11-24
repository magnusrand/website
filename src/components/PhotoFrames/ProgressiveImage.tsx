import React from 'react'

type ProgressiveImageProps = {
    src: string
    placeholderSrc: string
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
    const imageRef = React.useRef<HTMLImageElement>(null)

    React.useEffect(() => {
        // TODO this needs to implement functionality to
        // delay loading untill image is close to be scrolled into view
        const imageToLoad = new Image()
        imageToLoad.src = src
        imageToLoad.onload = function () {
            setImageSrc(src)
            imageRef.current?.style.setProperty(
                '--image-height',
                // @ts-expect-error height does indeed exist
                this.height + 'px',
            )
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

    return (
        <img
            ref={imageRef}
            src={imageSrc}
            alt={alt}
            className={'progressive-img ' + className}
            loading="lazy"
            tabIndex={focusable ? 0 : undefined}
            {...rest}
        />
    )
}
