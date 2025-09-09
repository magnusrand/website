import React, { useLayoutEffect, useRef, useState } from 'react'

import { wrapGrid } from 'animate-css-grid'

import { MainNavBar } from '@components/NavBar/MainNavBar'

import './landingpage-styles.css'

export const LandingPage = () => {
    const [logoPosition, setLogoPosition] = useState<string>('primary')
    const gridRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if (gridRef.current)
            wrapGrid(gridRef.current, {
                easing: 'backOut',
                stagger: 10,
                duration: 600,
            })
    }, [gridRef])

    const onClickLogo = () =>
        setLogoPosition(logoPosition === 'primary' ? 'secondary' : 'primary')

    return (
        <div ref={gridRef} className="landing-page main-grid">
            <div className="background-letter type-garamond-regular">R</div>
            <div className="horizontal-bar1" />
            <div className="horizontal-bar2" />
            <div className="horizontal-bar3" />
            <div
                className={`logo-horizontal position-${logoPosition} type-garamond-bold font-size-extralarge`}
                onClick={onClickLogo}
            >
                MAGNUS
            </div>
            <div
                className={`logo-vertical position-${logoPosition} type-garamond-regular font-size-extralarge`}
                onClick={onClickLogo}
            >
                <div className="logo-vertical-type-container">
                    <div>R</div>
                    <div className="logo-overlapping-letter-A">A</div>
                    <div className="logo-overlapping-letter-N">N</div>
                    <div>D</div>
                </div>
            </div>
        </div>
    )
}
