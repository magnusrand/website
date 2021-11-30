import React, { useLayoutEffect, useRef, useState } from 'react'

import { wrapGrid } from 'animate-css-grid'

import {
    NavBar,
    NavItem,
    Dropdown,
    DropdownItem,
} from '../components/NavBar/NavBar'
import { Color } from '../types'

import '../main-styles.css'

import '../components/NavBar/styles.css'

export const LandingPage = () => {
    const [logoPosition, setLogoPosition] = useState<string>('primary')
    const gridRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if (gridRef.current)
            wrapGrid(gridRef.current, {
                easing: 'backInOut',
                stagger: 10,
                duration: 400,
            })
    }, [gridRef])

    const onClickLogo = () =>
        setLogoPosition(logoPosition === 'primary' ? 'secondary' : 'primary')

    return (
        <div ref={gridRef} className="landing-page main-grid">
            <NavBar>
                <NavItem title="Fotografi" color={Color.DARK1}>
                    <Dropdown>
                        <DropdownItem title="Utvalgte" linkPath="dritt" />
                        <DropdownItem title="Alle bilder" linkPath="" />
                    </Dropdown>
                </NavItem>
                <NavItem
                    title="GitHub"
                    color={Color.DARK2}
                    expandIcon={false}
                    linkPath="/github"
                />
                <NavItem title="Om meg" color={Color.DARK3}>
                    <Dropdown>
                        <DropdownItem title="CV" linkPath="" />
                        <DropdownItem title="Kontakt meg" linkPath="" />
                    </Dropdown>
                </NavItem>
            </NavBar>

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
                <div>
                    R<span className="logo-overlapping-letter-A">A</span>
                    <span className="logo-overlapping-letter-N">N</span>D
                </div>
            </div>
        </div>
    )
}
