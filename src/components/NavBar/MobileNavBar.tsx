import React from 'react'
import classNames from 'classnames'
import {
    MdAlbum,
    MdCamera,
    MdMenu,
    MdOutlineGridView,
    MdOutlinePhotoLibrary,
} from 'react-icons/md'
import { FaGithub, FaLinkedin, FaSoundcloud, FaTags } from 'react-icons/fa'
import {
    MobileNavDropdown,
    MobileNavDropdownItem,
    MobileNavItem,
    NavBar,
} from './NavBar'

import './mobile-navbar-styles.css'

import HomeLogoSvg from '@assets/images/magnusrand.svg'

export const MobileNavBar = ({
    hideHomeLogo = false,
    hideNavbar = false,
    scrolled = false,
    showCollapsed = false,
    toggleCollapsed = () => {},
    navRef,
}: {
    hideHomeLogo?: boolean
    hideNavbar?: boolean
    scrolled?: boolean
    showCollapsed?: boolean
    toggleCollapsed?: () => void
    navRef?: React.RefObject<HTMLDivElement>
}) => {
    return (
        <NavBar
            className={classNames('mobile-navbar', {
                'mobile-navbar--collapsed': showCollapsed,
                'mobile-navbar--animate-out': scrolled,
            })}
            navRef={navRef}
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
                    <MobileNavDropdown title="Foto" icon={<MdCamera />}>
                        <MobileNavDropdownItem
                            title="Etiketter"
                            icon={<FaTags />}
                            linkPath="foto/etiketter"
                        />
                        <MobileNavDropdownItem
                            title="Album"
                            icon={<MdAlbum />}
                            linkPath="foto/album"
                        />
                        <MobileNavDropdownItem
                            title="Utvalgte"
                            icon={<MdOutlinePhotoLibrary />}
                            linkPath="foto/utvalgte"
                        />
                    </MobileNavDropdown>
                    <MobileNavItem
                        title="Github"
                        icon={<FaGithub />}
                        linkPath="/github"
                    />
                    <MobileNavDropdown
                        title="Annet"
                        icon={<MdOutlineGridView />}
                    >
                        <MobileNavDropdownItem
                            title="LinkedIn"
                            icon={<FaLinkedin />}
                            linkPath="linkedin"
                        />
                        <MobileNavDropdownItem
                            title="Musikk"
                            icon={<FaSoundcloud />}
                            linkPath="musikk"
                        />
                    </MobileNavDropdown>
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
