import React from 'react'
import { MobileNavItem, NavBar } from './NavBar'

import './mobile-navbar-styles.css'
import { MdCamera, MdOutlineGridView } from 'react-icons/md'
import { FaGithub } from 'react-icons/fa'

import HomeLogoSvg from '@assets/images/magnusrand.svg'
import { useLocation } from 'react-router-dom'

export const MobileNavBar = ({ hideNavbar = false }) => {
    const { pathname } = useLocation()
    return (
        <NavBar className="mobile-navbar">
            {pathname !== '/' && (
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
        </NavBar>
    )
}
