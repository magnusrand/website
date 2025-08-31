import React from 'react'
import { MobileNavItem, NavBar } from './NavBar'

import './mobile-navbar-styles.css'
import { MdCamera, MdMenu, MdOutlineGridView } from 'react-icons/md'
import { FaGithub } from 'react-icons/fa'

import HomeLogoSvg from '@assets/images/magnusrand.svg'
import { useLocation } from 'react-router-dom'
import classNames from 'classnames'

export const MobileNavBar = ({
    hideHomeLogo = false,
    hideNavbar = false,
    scrolled = false,
    showCollapsed = false,
    toggleCollapsed = () => {},
}) => {
    return (
        <NavBar
            className={classNames('mobile-navbar', {
                'mobile-navbar--collapsed': showCollapsed,
                'mobile-navbar--animate-out': scrolled,
            })}
        >
            {!showCollapsed && (
                <>
                    {!hideHomeLogo && (
                        <MobileNavItem
                            icon={
                                <HomeLogoSvg
                                    aria-label="Startside"
                                    height="45"
                                    width="45"
                                />
                            }
                            linkPath="/"
                        />
                    )}
                    <MobileNavItem
                        title="Foto"
                        icon={<MdCamera />}
                        linkPath="/foto/album"
                    />
                    <MobileNavItem
                        title="Github"
                        icon={<FaGithub />}
                        linkPath="/github"
                    />
                    <MobileNavItem
                        title="Annet"
                        icon={<MdOutlineGridView />}
                        linkPath="/annet"
                    />
                </>
            )}
            {showCollapsed && (
                <button
                    className={classNames(
                        'mobile-navbar--collapsed__button',
                        'fade-in',
                        { 'fade-out': !scrolled && showCollapsed },
                    )}
                    onClick={toggleCollapsed}
                >
                    <MdMenu />
                </button>
            )}
        </NavBar>
    )
}
