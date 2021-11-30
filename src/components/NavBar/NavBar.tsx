import React, { useState } from 'react'

import { Link } from 'react-router-dom'

import debounce from 'lodash.debounce'
import { IoTriangleSharp } from 'react-icons/io5'

import type { Color } from '../../types'

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
    linkPath?: string
    children?: React.ReactNode
}

export const NavItem = ({ expandIcon = true, ...props }: NavItemProps) => {
    const [open, setOpen] = useState<boolean>(false)

    const onClick = () => {
        setOpen(!open)
    }

    const debounceMouseLeave = debounce(() => setOpen(false), 300)

    return (
        <div
            className={`navitem ${open ? 'hover' : ''}`}
            style={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ['--nav-item-color' as any]: `var(${props.color})`,
            }}
            onMouseEnter={() => debounceMouseLeave.cancel()}
            onMouseLeave={debounceMouseLeave}
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
    <Link to={'/' + props.linkPath} className="dropdown-item">
        {props.title}
    </Link>
)
