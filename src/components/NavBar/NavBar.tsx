import React, { useState } from 'react'

import { IoTriangleSharp } from 'react-icons/io5'

import '../../main-styles.css'
import './styles.css'

interface NavBarProps {
    children?: React.ReactNode
}

export const NavBar = (props: NavBarProps) => (
    <nav className="header type-garamond-regular font-size-medium">
        {props.children}
    </nav>
)

interface NavItemProps {
    title: string
    children?: React.ReactNode
}

export const NavItem = (props: NavItemProps) => {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <div className="navitem">
            <a href="#">
                {props.title}
                <IoTriangleSharp className="expand-icon" />
            </a>
        </div>
    )
}

interface NavSubItemsProps {
    title: string
    linkPath: string
}

export const NavSubItem = (props: NavSubItemsProps) => {
    return <div></div>
}
