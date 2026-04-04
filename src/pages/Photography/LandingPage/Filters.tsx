import React from 'react'

export const Filters = () => {
    return (
        <svg
            id="svgfilters"
            aria-hidden="true"
            style={{
                position: 'absolute',
                width: 0,
                height: 0,
                overflow: 'hidden',
            }}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <filter
                    id="blue-white"
                    x="-10%"
                    y="-10%"
                    width="120%"
                    height="120%"
                    filterUnits="objectBoundingBox"
                    primitiveUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                >
                    <feColorMatrix
                        type="matrix"
                        values=".33 .33 .33 0 0
          .33 .33 .33 0 0
          .33 .33 .33 0 0
          0 0 0 1 0"
                        in="SourceGraphic"
                        result="colormatrix"
                    />
                    <feComponentTransfer
                        in="colormatrix"
                        result="componentTransfer"
                    >
                        <feFuncR type="table" tableValues="0.07 1" />
                        <feFuncG type="table" tableValues="0.30 1" />
                        <feFuncB type="table" tableValues="0.41 1" />
                        <feFuncA type="table" tableValues="0 1" />
                    </feComponentTransfer>
                    <feBlend
                        mode="normal"
                        in="componentTransfer"
                        in2="SourceGraphic"
                        result="blend"
                    />
                </filter>
            </defs>
        </svg>
    )
}
