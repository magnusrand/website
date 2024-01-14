import React from 'react'

import { Color } from '../../types'

import { NavBar, NavItem, Dropdown, DropdownItem } from './NavBar'

import './mainNavBar.css'

export const MainNavBar = (): JSX.Element => {
    React.useEffect(() => {
        // const handleScroll = () => {
        // const navBar = document.getElementById('navbar')
        // if (navBar) {
        //     if (mainGrid && mainGrid.scrollTop > 0) {
        //         navBar.classList.add('navbar--scrolled')
        //     } else {
        //         navBar.classList.remove('navbar--scrolled')
        //     }
        // }
        // }
        const mainGrid = document.querySelector('.main-grid')
        console.log('mainGrid', mainGrid)

        if (mainGrid) {
            mainGrid.addEventListener('scroll', (event) => {
                const navBar = document.querySelector('.navbar')
                if (navBar) {
                    if (mainGrid && mainGrid.scrollTop > 0) {
                        navBar.classList.add('navbar--scrolled')
                    } else {
                        navBar.classList.remove('navbar--scrolled')
                    }
                }
            })
        }
        return () => {
            if (mainGrid) {
                mainGrid.removeEventListener('scroll', (event) =>
                    console.log('scroll fired'),
                )
            }
        }
    }, [])

    return (
        <NavBar>
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
        </NavBar>
    )
}

export default MainNavBar
