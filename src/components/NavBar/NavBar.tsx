import React, { useState } from 'react'

import { IoTriangleSharp } from 'react-icons/io5'

import { Color } from '../../types'

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
    expandIcon?: boolean
    color?: Color
    children?: React.ReactNode
}

export const NavItem = ({ expandIcon = true, ...props }: NavItemProps) => {
    const [open, setOpen] = useState<boolean>(false)

    const onClick = () => {
        setOpen(!open)
    }

    const onMouseEnter = () => {}

    const onMouseLeave = () => {
        setOpen(false)
    }

    return (
        <div
            className="navitem"
            style={{
                ['--nav-item-color' as any]: `var(${props.color})`,
            }}
            onMouseEnter={() => {}}
            onMouseLeave={onMouseLeave}
        >
            <a href="#" onClick={onClick}>
                {props.title}
                {expandIcon && (
                    <IoTriangleSharp
                        className={`expand-icon ${open ? 'open' : ''}`}
                    />
                )}
            </a>
            {open && props.children}
        </div>
    )
}

interface DropdownProps {
    children?: React.ReactNode
}

export const Dropdown = (props: DropdownProps) => {
    return <div className="dropdown font-size-small">{props.children}</div>
}

interface DropdownItemsProps {
    title: string
    linkPath: string
}

export const DropdownItem = (props: DropdownItemsProps) => {
    return (
        <a href="#" className="dropdown-item">
            {props.title}
        </a>
    )
}
