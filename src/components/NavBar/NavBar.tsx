import React, { useState } from 'react'

import { Link } from 'react-router-dom'

import { IoTriangleSharp } from 'react-icons/io5'

import { useDebounce } from '../utils'

import type { Color } from '../../types'

import './navbar-styles.css'

interface NavBarProps {
    children?: React.ReactNode
    className?: string
}

export const NavBar = (props: NavBarProps) => (
    <div className="header">
        <nav
            className={`navbar type-garamond-regular font-size-medium ${props.className}`}
        >
            {props.children}
        </nav>
    </div>
)

interface NavItemProps {
    title: string
    expandIcon?: boolean
    color?: Color
    linkPath?: string
    children?: React.ReactNode
}

export const NavItem = ({ expandIcon = true, ...props }: NavItemProps) => {
    const [open, setOpen] = useState<boolean>(false)

    const onClick = () => {
        setOpen(!open)
    }

    const debounceMouseLeave = useDebounce(() => setOpen(false), 300)

    return (
        <div
            className={`navitem ${open ? 'hover' : ''}`}
            style={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ['--nav-item-color' as any]: `var(${props.color})`,
            }}
            onMouseEnter={debounceMouseLeave.cancel}
            onMouseLeave={debounceMouseLeave.func}
            onClick={() => {
                if (!props.linkPath) onClick()
            }}
        >
            <Link to={props.linkPath ?? ''}>
                {props.title}
                {expandIcon && (
                    <IoTriangleSharp
                        className={`expand-icon ${open ? 'open' : ''}`}
                    />
                )}
            </Link>
            {open && props.children}
        </div>
    )
}

interface DropdownProps {
    children?: React.ReactNode
}

export const Dropdown = (props: DropdownProps) => (
    <div className="dropdown type-sourcesans-regular font-size-small">
        {props.children}
    </div>
)

interface DropdownItemsProps {
    title: string
    linkPath: string
}

export const DropdownItem = (props: DropdownItemsProps) => (
    <Link to={props.linkPath} className="dropdown-item">
        {props.title}
    </Link>
)
