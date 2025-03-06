import React, { useEffect } from 'react'

import './siteHeading.css'

export const SiteHeading = (props: {
    siteName: string
    headingRef?: React.RefObject<HTMLDivElement>
}) => {
    const MAX_FONT_SIZE = 200
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const textRef = React.useRef<HTMLDivElement | null>(null)
    const [fontSize, setFontSize] = React.useState(MAX_FONT_SIZE)

    React.useEffect(() => {
        const adjustFontSize = () => {
            if (!containerRef.current || !textRef.current) return

            const containerWidth = containerRef.current.offsetWidth
            const textWidth = textRef.current.offsetWidth

            if (textWidth > containerWidth) {
                let newFontSize = MAX_FONT_SIZE
                while (
                    textRef.current.offsetWidth > containerWidth &&
                    newFontSize > 5
                ) {
                    newFontSize -= 1
                    setFontSize(newFontSize)
                }
            }
        }

        const observer = new ResizeObserver(adjustFontSize)
        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (textRef.current) {
            textRef.current.style.setProperty(
                '--calculated-font-size',
                `${fontSize}px`,
            )
        }
    }, [fontSize])

    const formatedSiteName = props.siteName
        .toLowerCase()
        .replace(/-/g, ' ')
        .replace(/^.|\s([a-zæøå])/g, (l) => l.toUpperCase())

    return (
        <>
            <div
                className="site-heading__horizontal-bar-top"
                ref={props.headingRef}
            >
                <h1 className="site-heading__horizontal-bar-top__text type-garamond-bold font-size-extralarge">
                    Fotografi
                </h1>
            </div>
            <div className="site-heading__horizontal-bar-bottom"></div>
            <div
                className="site-heading__horizontal-bar-bottom__text-container"
                ref={containerRef}
            >
                <h2
                    className="site-heading__horizontal-bar-bottom__text-container__text type-garamond-regular font-size-extralarge"
                    ref={textRef}
                >
                    {`– ${formatedSiteName}`}
                </h2>
            </div>
        </>
    )
}
