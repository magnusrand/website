import React from 'react'

import './Button.css'

export const Button = ({
    children,
    className,
    variant = 'primary',
    ...rest
}: {
    children: React.ReactNode
    onClick?: () => void
    className?: string
    variant?: 'primary' | 'secondary' | 'negative'
    tabIndex?: number
}) => (
    <button
        className={`mr-button type-garamond-regular mr-button--${variant} ${className}`}
        type="button"
        {...rest}
    >
        {children}
    </button>
)
