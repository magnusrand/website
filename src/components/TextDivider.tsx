import React from 'react'

interface TextDividerProps {
    index: number
    text?: string
}

export const TextDivider = ({
    index,
    text = '«... og masse masse mer»',
}: TextDividerProps) => (
    <div
        className="text-divider-wrapper"
        style={{
            ['--divider-color' as any]: `var(--${
                Math.random() > 0.5 ? 'light' : 'dark'
            }-color-${Math.ceil(Math.random() * 3)})`,
        }}
    >
        <div
            className={`text-divider__background--${
                index % 2 === 0 ? 'right' : 'left'
            }`}
        >
            <div
                className={`text-divider__text text-divider__text--${
                    index % 2 === 0 ? 'right' : 'left'
                } type-garamond-regular font-size-small`}
            >
                {text}
            </div>
        </div>
    </div>
)
