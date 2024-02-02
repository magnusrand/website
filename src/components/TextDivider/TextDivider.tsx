import React from 'react'

import './textDivider.css'

interface TextDividerProps {
    text?: string
}

export const TextDivider = ({
    text = '«... og masse masse mer»',
}: TextDividerProps) => (
    <div className="text-divider-wrapper">
        <div className="text-divider__background">
            <div className="text-divider__text text-divider__text type-garamond-regular font-size-small">
                {text}
            </div>
        </div>
    </div>
)
