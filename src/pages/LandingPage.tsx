import React from 'react'
import VisualBackgroundGrid from '../components/BackgroundGrid'
import {
    NavBar,
    NavItem,
    Dropdown,
    DropdownItem,
} from '../components/NavBar/NavBar'
import { Color } from '../types'

export const LandingPage = () => {
    return (
        <>
            <NavBar>
                <NavItem title="Fotografi" color={Color.DARK1}>
                    <Dropdown>
                        <DropdownItem title={'Utvalgte'} linkPath="dritt" />
                        <DropdownItem title={'Alle bilder'} linkPath="" />
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
            <div className="main-content"></div>
            <div className="horizontal-bar1"></div>
            <div className="horizontal-bar2"></div>
            <div className="horizontal-bar3"></div>
        </>
    )
}
