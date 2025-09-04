import React, { useEffect } from 'react'

import './siteHeading.css'
import { useWindowDimensions } from '@components/utils'

export const SiteHeading = (props: {
    siteName: string
    headingRef?: React.RefObject<HTMLDivElement>
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const headingRef = React.useRef<HTMLHeadingElement>(null)
    const canvasRef = React.useRef<HTMLCanvasElement>(
        document.createElement('canvas'),
    )

    React.useLayoutEffect(() => {
        const container = containerRef.current
        const heading = headingRef.current
        if (!container || !heading) return

        // Measure with canvas and fit font-size to both width and cap-height
        const computeFontSize = () => {
            const text = (heading.textContent || '').trim()
            if (!text) return

            const {
                clientWidth: containerWidth,
                clientHeight: containerHeight,
            } = container
            if (containerWidth <= 0 || containerHeight <= 0) return

            const ctx = canvasRef.current.getContext('2d')
            if (!ctx) return

            const measureSize = 100
            const headingStyle = getComputedStyle(heading)

            ctx.font = `${headingStyle.fontStyle} ${headingStyle.fontVariant} ${headingStyle.fontWeight} '100%' ${measureSize}px ${headingStyle.fontFamily}`

            const widthInActualPx = ctx.measureText(text).width / measureSize

            // Cap height proxy via 'H'
            const capitalLetter = ctx.measureText('H')
            const capHeightRelativeToMeasure =
                capitalLetter.actualBoundingBoxAscent ??
                capitalLetter.fontBoundingBoxAscent ??
                measureSize * 0.7
            const capHeightInActualPx = capHeightRelativeToMeasure / measureSize

            const fromHeight = containerHeight / capHeightInActualPx
            const fromWidth = containerWidth / widthInActualPx
            const calculatedFontSize = Math.floor(
                Math.min(fromHeight, fromWidth) / 9,
            )

            if (Number.isFinite(calculatedFontSize)) {
                heading.style.setProperty(
                    '--calculated-font-size',
                    `${calculatedFontSize}px`,
                )
            }
        }

        const ro = new ResizeObserver(() =>
            // Request animation frame to avoid two updates in same frame
            requestAnimationFrame(computeFontSize),
        )
        ro.observe(container)
        document.fonts?.ready?.then(computeFontSize)
        computeFontSize()

        return () => ro.disconnect()
    }, [])

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
                    ref={headingRef}
                >
                    {`– ${formatedSiteName}`}
                </h2>
            </div>
        </>
    )
}
