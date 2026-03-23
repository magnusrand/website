import React from 'react'

import classNames from 'classnames'

import { Color } from 'src/types'

import { NavBar, NavItem, Dropdown, DropdownItem } from './NavBar'
import { HomeLogo } from './HomeLogo'

import './mainNavBar.css'

export const DesktopNavBar = ({
    hideHomeLogo = false,
    hideNavbar = false,
    scrolled = false,
    showCollapsed = false,
    toggleCollapsed = () => {},
}): React.ReactElement => {
    if (hideNavbar)
        return (
            <div className="header">
                <NavBar />
            </div>
        )

    if (showCollapsed)
        return (
            <NavBar
                className={classNames('main-navbar', 'fade-in', {
                    'fade-out': !scrolled,
                })}
            >
                <div
                    className={classNames(
                        'main-navbar--collapsed font-size-small',
                        {
                            'main-navbar--collapsed--opened': !scrolled,
                        },
                    )}
                >
                    <button
                        className="main-navbar--collapsed__button"
                        onClick={toggleCollapsed}
                    >
                        Meny
                    </button>
                </div>
            </NavBar>
        )

    return (
        <NavBar
            className={classNames('main-navbar', 'fade-in', {
                'fade-out': scrolled,
            })}
        >
            <NavItem title="Fotografi" color={Color.DARK1}>
                <Dropdown>
                    <DropdownItem title="Utvalgte" linkPath="/foto/utvalgte" />
                    <DropdownItem title="Alle album" linkPath="/foto/album" />
                    <DropdownItem
                        title="Etiketter"
                        linkPath="/foto/etiketter"
                    />
                </Dropdown>
            </NavItem>
            <NavItem title="Prosjekter" color={Color.DARK2}>
                <Dropdown>
                    <DropdownItem
                        title="Github"
                        linkPath="https://github.com/magnusrand"
                    />
                    <DropdownItem
                        title="Lunsjguiden"
                        linkPath="https://lunsjguiden.no"
                    />
                </Dropdown>
            </NavItem>
            <NavItem title="Annet" color={Color.DARK3}>
                <Dropdown>
                    <DropdownItem
                        title="LinkedIn"
                        linkPath="https://www.linkedin.com/in/magnus-rand-363489122/"
                    />
                    <DropdownItem
                        title="Musikk"
                        linkPath="https://soundcloud.com/magnus-rand"
                    />
                </Dropdown>
            </NavItem>
            {!hideHomeLogo && <HomeLogo />}
        </NavBar>
    )
}
