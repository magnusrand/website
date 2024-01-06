import React from 'react'

import { Color } from '../../types'

import { NavBar, NavItem, Dropdown, DropdownItem } from './NavBar'

export const MainNavBar = (): JSX.Element => (
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

export default MainNavBar
