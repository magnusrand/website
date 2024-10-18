import React from 'react'

import './Tag.css'

export const Tag = ({
    children,
    className,
    ...rest
}: {
    children: string
    onClick?: () => void
    className?: string
    name: string
}) => (
    <label className="mr-tag__label">
        {children}
        <input
            type="radio"
            id={children}
            className={`mr-tag ${className}`}
            {...rest}
        />
    </label>
)
