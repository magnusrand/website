import React from 'react'

import './iconButton.css'

export const IconButton = ({
    children,
    className,
    variant = 'primary',
    ...rest
}: {
    children: React.ReactNode
    onClick?: () => void
    className?: string
    variant?: 'primary' | 'secondary'
}) => (
    <button
        className={`icon-button ${className} icon-button--${variant}`}
        {...rest}
    >
        {children}
    </button>
)
