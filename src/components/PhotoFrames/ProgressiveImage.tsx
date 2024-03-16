import React from 'react'

type ProgressiveImageProps = {
    src: string
    placeholderSrc: string
    alt?: string
    className?: string
} & React.ImgHTMLAttributes<HTMLImageElement>

export const ProgressiveImage = ({
    src,
    placeholderSrc,
    alt,
    className,
    ...rest
}: ProgressiveImageProps) => {
    const [imageSrc, setImageSrc] = React.useState(placeholderSrc)

    React.useEffect(() => {
        const imageToLoad = new Image()
        imageToLoad.src = src
        imageToLoad.onload = () => {
            setImageSrc(src)
        }
    }, [src])

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={'progressive-img ' + className}
            loading="lazy"
            {...rest}
        />
    )
}
