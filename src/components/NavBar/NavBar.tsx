import React, { useState } from 'react'

import { Link } from 'react-router-dom'

import { IoTriangleSharp } from 'react-icons/io5'

import type { Color } from 'src/types'

import { useDebounce } from '../utils'

import './navbar-styles.css'

interface NavBarProps {
    children?: React.ReactNode
    className?: string
}

export const NavBar = (props: NavBarProps) => (
    <nav
        className={`navbar type-garamond-regular font-size-medium ${props.className}`}
    >
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

    const debounceMouseLeave = useDebounce(() => setOpen(false), 300)

    const Element = props.linkPath !== undefined ? Link : 'button'

    const conditionalProps = {
        ...(props.linkPath !== undefined && { to: props.linkPath ?? '' }),
    }

    return (
        <Element
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
            to=""
            {...conditionalProps}
        >
            {props.title}
            {expandIcon && (
                <IoTriangleSharp
                    className={`expand-icon ${open ? 'open' : ''}`}
                />
            )}
            {open && props.children}
        </Element>
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

interface MobileNavItemProps {
    title?: string
    icon?: React.ReactNode
    color?: Color
    linkPath?: string
    children?: React.ReactNode
}

export const MobileNavItem = ({
    title,
    linkPath = '#',
    icon,
}: MobileNavItemProps) => (
    <Link to={linkPath} className="mobile-navitem fade-in">
        {icon}
        {title !== undefined && (
            <span className="type-sourcesans-regular">{title}</span>
        )}
    </Link>
)
