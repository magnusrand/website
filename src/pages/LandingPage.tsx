import React from 'react'

import {
    NavBar,
    NavItem,
    Dropdown,
    DropdownItem,
} from '../components/NavBar/NavBar'
import { Color } from '../types'

import '../main-styles.css'

import '../components/NavBar/styles.css'

export const LandingPage = () => (
    <>
        <div className="landing-page main-grid">
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
            <div className="logo-horizontal type-garamond-bold font-size-extralarge">
                MAGNUS
            </div>
            <div className="logo-vertical type-garamond-regular font-size-extralarge">
                RA<span className="logo-overlapping-letter">N</span>D
            </div>
        </div>
    </>
)
