import React from 'react'

import { MobileNavBar } from './MobileNavBar'
import { DesktopNavBar } from './DesktopNavBar'

import { BREAKPOINTS, useWindowDimensions } from '@components/utils'

import './mainNavBar.css'

export const MainNavBar = ({
    hideHomeLogo = false,
    hideNavbar = false,
}): JSX.Element => {
    const [scrolled, setScrolled] = React.useState(false)
    const [showCollapsed, setShowCollapsed] = React.useState(false)
    const { width } = useWindowDimensions()

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
