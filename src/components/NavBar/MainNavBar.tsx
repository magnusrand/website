import React from 'react'

import classNames from 'classnames'

import { Color } from '../../types'

import { NavBar, NavItem, Dropdown, DropdownItem } from './NavBar'
import { HomeLogo } from './HomeLogo'

import './mainNavBar.css'

export const MainNavBar = ({
    hideHomeLogo = false,
    hideNavbar = false,
}): JSX.Element => {
    const [scrolled, setScrolled] = React.useState(false)
    const [showCollapsed, setShowCollapsed] = React.useState(false)

    React.useEffect(() => {
        const mainGrid = document.querySelector('.main-grid')
        const handleNavbarCollapse = () => {
            const header = document.querySelector('.header')
            if (header) {
                if (mainGrid && mainGrid.scrollTop > 0) {
                    if (scrolled) return
                    const timer = setTimeout(() => {
                        setShowCollapsed(true)
                    }, 500)
                    return () => clearTimeout(timer)
                } else {
                    if (!scrolled) return
                    const timer = setTimeout(() => {
                        setShowCollapsed(false)
                    }, 500)
                    return () => clearTimeout(timer)
                }
            }
        }

        if (mainGrid) {
            mainGrid.addEventListener('scroll', handleNavbarCollapse)
        }
        return () => {
            if (mainGrid) {
                mainGrid.removeEventListener('scroll', handleNavbarCollapse)
            }
        }
    }, [scrolled])

    React.useEffect(() => {
        const mainGrid = document.querySelector('.main-grid')
        const handleScrollState = () => {
            if (mainGrid && mainGrid.scrollTop > 0) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }
        if (mainGrid) {
            mainGrid.addEventListener('scroll', handleScrollState)
        }
        return () => {
            if (mainGrid) {
                mainGrid.removeEventListener('scroll', handleScrollState)
            }
        }
    }, [])

    if (hideNavbar) return <NavBar></NavBar>

    if (showCollapsed)
        return (
            <NavBar
                className={classNames('fade-in', {
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
                        onClick={() => {
                            setScrolled(false)
                            setTimeout(() => {
                                setShowCollapsed(false)
                            }, 500)
                        }}
                    >
                        Meny
                    </button>
                </div>
            </NavBar>
        )

    return (
        <NavBar className={classNames('fade-in', { 'fade-out': scrolled })}>
            <NavItem title="Fotografi" color={Color.DARK1}>
                <Dropdown>
                    <DropdownItem title="Utvalgte" linkPath="foto/utvalgte" />
                    <DropdownItem title="Alle album" linkPath="foto" />
                </Dropdown>
            </NavItem>
            <NavItem
                title="GitHub"
                color={Color.DARK2}
                expandIcon={false}
                linkPath="/github"
            />
            <NavItem title="Annet" color={Color.DARK3}>
                <Dropdown>
                    <DropdownItem title="CV" linkPath="" />
                    <DropdownItem title="Kontakt meg" linkPath="" />
                </Dropdown>
            </NavItem>
            {!hideHomeLogo && <HomeLogo />}
        </NavBar>
    )
}

export default MainNavBar
