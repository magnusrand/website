import React from 'react'

import { MobileNavBar } from './MobileNavBar'
import { DesktopNavBar } from './DesktopNavBar'

import { BREAKPOINTS, useWindowDimensions } from '@components/utils'

import './mainNavBar.css'
import { useLocation } from 'react-router-dom'

export const MainNavBar = ({
    hideHomeLogo = false,
    hideNavbar = false,
}): JSX.Element => {
    const [scrolled, setScrolled] = React.useState(false)
    const [showCollapsed, setShowCollapsed] = React.useState(false)
    const navRef = React.useRef<HTMLDivElement>(null)
    const { width } = useWindowDimensions()
    const { pathname } = useLocation()

    React.useEffect(() => {
        const mainGrid = document.querySelector('.main-grid')
        const handleNavbarCollapse = () => {
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

        if (mainGrid) {
            mainGrid.addEventListener('scroll', handleNavbarCollapse)
        }
        return () => {
            if (mainGrid) {
                mainGrid.removeEventListener('scroll', handleNavbarCollapse)
            }
        }
    }, [scrolled, pathname])

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
    }, [pathname])

    const handleClickOutside = (event: MouseEvent) => {
        const mainGrid = document.querySelector('.main-grid')

        if (
            navRef.current &&
            !navRef.current.contains(event.target as Node) &&
            mainGrid &&
            mainGrid.scrollTop > 0
        ) {
            setShowCollapsed(true)
            setScrolled(true)
        }
    }

    React.useEffect(() => {
        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [pathname])

    if (width < BREAKPOINTS.mobile) {
        return (
            <MobileNavBar
                hideHomeLogo={hideHomeLogo}
                hideNavbar={hideNavbar}
                scrolled={scrolled}
                showCollapsed={showCollapsed}
                toggleCollapsed={() => {
                    setScrolled(!showCollapsed)
                    setTimeout(() => {
                        setShowCollapsed(!showCollapsed)
                    }, 500)
                }}
                navRef={navRef}
            />
        )
    }

    return (
        <DesktopNavBar
            hideHomeLogo={hideHomeLogo}
            hideNavbar={hideNavbar}
            scrolled={scrolled}
            showCollapsed={showCollapsed}
            toggleCollapsed={() => {
                setScrolled(!showCollapsed)
                setTimeout(() => {
                    setShowCollapsed(!showCollapsed)
                }, 500)
            }}
        />
    )
}
