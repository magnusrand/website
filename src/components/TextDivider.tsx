import React from 'react'

interface TextDividerProps {
    index: number
    text?: string
}

export const TextDivider = ({
    index,
    text = '«... og masse masse mer»',
}: TextDividerProps) => {
    const side = index % 2 === 0 ? 'right' : 'left'
    return (
        <div
            className="text-divider-wrapper"
            style={{
                ['--divider-color' as any]: `var(--${
                    Math.random() > 0.5 ? 'light' : 'dark'
                }-color-${Math.ceil(Math.random() * 3)})`,
            }}
        >
            {side === 'right' && <div style={{ flex: '2' }} />}
            <div className={`text-divider__background--${side}`}>
                <div
                    className={`text-divider__text text-divider__text--${side} type-garamond-regular font-size-small`}
                >
                    {text}
                </div>
            </div>
            {side === 'left' && <div style={{ flex: '2' }} />}
        </div>
    )
}
