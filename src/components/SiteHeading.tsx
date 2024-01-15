import React from 'react'

import './siteHeading.css'

export const SiteHeading = (props: { siteName: string }) => (
    <>
        <div className="site-heading__horizontal-bar-top" />
        <div className="site-heading__horizontal-bar-top__text type-garamond-bold font-size-extralarge">
            Fotografi
        </div>
        <div className="site-heading__horizontal-bar-bottom" />
        <div className="site-heading__horizontal-bar-bottom__text type-garamond-regular font-size-extralarge">
            {`– ${props.siteName}`}
        </div>
    </>
)
