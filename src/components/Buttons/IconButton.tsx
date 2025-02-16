import React, { HTMLAttributes } from 'react'

import './iconButton.css'

export const IconButton = ({
    children,
    className,
    variant = 'primary',
    as,
    ...rest
}: {
    children: React.ReactNode
    onClick?: () => void
    className?: string
    variant?: 'primary' | 'secondary'
    tabIndex?: number
    as?: 'button' | 'a' | React.ElementType
    to?: string
} & HTMLAttributes<HTMLButtonElement>) => {
    const Element = as || 'button'
    return (
        <Element
            className={`icon-button ${className} icon-button--${variant}`}
            type="button"
            {...rest}
        >
            {children}
        </Element>
    )
}
