import React from 'react'

import './siteHeading.css'

export const SiteHeading = (props: { siteName: string }) => (
    <>
        <div className="horizontal-bar-top" />
        <div className="horizontal-bar-top__text type-garamond-bold font-size-extralarge">
            Fotografi
        </div>
        <div className="horizontal-bar-bottom" />
        <div className="horizontal-bar-bottom__text type-garamond-regular font-size-extralarge">
            {`– ${props.siteName}`}
        </div>
    </>
)
