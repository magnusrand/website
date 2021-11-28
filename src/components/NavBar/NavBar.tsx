import React, { useState } from 'react'
import debounce from 'lodash.debounce'
import { IoTriangleSharp } from 'react-icons/io5'

import { Color } from '../../types'

import '../../main-styles.css'
import './styles.css'
import { Link } from 'react-router-dom'

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

    const LinkElement = props.linkPath ? (
        <Link to={props.linkPath}>
            {props.title}
            {expandIcon && (
                <IoTriangleSharp
                    className={`expand-icon ${open ? 'open' : ''}`}
                />
            )}
        </Link>
    ) : (
        <a href="#" onClick={onClick}>
            {props.title}
            {expandIcon && (
                <IoTriangleSharp
                    className={`expand-icon ${open ? 'open' : ''}`}
                />
            )}
        </a>
    )

    return (
        <div
            className={`navitem ${open ? 'hover' : ''}`}
            style={{
                ['--nav-item-color' as any]: `var(${props.color})`,
            }}
            onMouseEnter={() => debounceMouseLeave.cancel()}
            onMouseLeave={debounceMouseLeave}
        >
            {LinkElement}
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
        <Link
            to={'/' + props.linkPath}
            className="dropdown-item type-sourcesans-regular"
        >
            {props.title}
        </Link>
    )
}
