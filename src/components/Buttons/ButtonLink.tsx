import React, { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import './Button.css'

export const ButtonLink = ({
    children,
    className,
    variant = 'primary',
    to,
    href,
    ...rest
}: {
    children: React.ReactNode
    onClick?: () => void
    className?: string
    style?: CSSProperties & Record<`--${string}`, string>
    variant?: 'primary' | 'secondary' | 'negative'
    tabIndex?: number
    to?: string
    href?: string
}) => {
    if (to)
        return (
            <Link
                className={`mr-button type-garamond-regular mr-button--${variant} ${className}`}
                type="button"
                tabIndex={0}
                to={to}
                {...rest}
            >
                {children}
            </Link>
        )

    return (
        <a
            className={`mr-button type-garamond-regular mr-button--${variant} ${className}`}
            type="button"
            tabIndex={0}
            href={href}
            {...rest}
        >
            {children}
        </a>
    )
}
