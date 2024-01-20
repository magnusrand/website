import React from 'react'

import './siteHeading.css'

export const SiteHeading = (props: { siteName: string }) => (
    <>
        <div className="site-heading__horizontal-bar-top" />
        <h1 className="site-heading__horizontal-bar-top__text type-garamond-bold font-size-extralarge">
            Fotografi
        </h1>
        <div className="site-heading__horizontal-bar-bottom" />
        <h2 className="site-heading__horizontal-bar-bottom__text type-garamond-regular font-size-extralarge">
            {`– ${props.siteName}`}
        </h2>
    </>
)
