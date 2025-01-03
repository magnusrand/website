import React, { forwardRef } from 'react'

export const TagGroup = forwardRef<
    HTMLFieldSetElement,
    {
        children: React.ReactNode
        className?: string
    }
>(function TagGroup({ children, className, ...rest }, ref) {
    return (
        <fieldset className={`mr-tag-group ${className}`} ref={ref} {...rest}>
            {children}
        </fieldset>
    )
})
