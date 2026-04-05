type ImageCache = {
    src: string
    height: number
    width: number
}

const imageCache = new Map<string, Promise<ImageCache>>()

export function getImage(src?: string) {
    if (!src) return undefined
    if (imageCache.has(src)) {
        const cached = imageCache.get(src)
        if (cached) return cached
    }

    const promise = new Promise<ImageCache>((resolve, reject) => {
        const img = new Image()

        img.onload = function () {
            resolve({ src, height: img.height, width: img.width })
        }

        img.onerror = () => {
            reject(new Error(`Failed to load image: ${src}`))
        }

        img.src = src
    })

    imageCache.set(src, promise)

    return promise
}
