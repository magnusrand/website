import React from 'react'
import { Link } from 'react-router-dom'
import HomeLogoSvg from '../../assets/images/magnusrand.svg'

import './navbar-styles.css'

export const HomeLogo = () => {
    return (
        <Link to="/" className="home-logo">
            <HomeLogoSvg />
        </Link>
    )
}
