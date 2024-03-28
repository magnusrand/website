import React from 'react'

import './siteHeading.css'

export const SiteHeading = (props: { siteName: string }) => {
    const formatedSiteName = props.siteName
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
    return (
        <>
            <div className="site-heading__horizontal-bar-top">
                <h1 className="site-heading__horizontal-bar-top__text type-garamond-bold font-size-extralarge">
                    Fotografi
                </h1>
            </div>
            <div className="site-heading__horizontal-bar-bottom">
                <h2 className="site-heading__horizontal-bar-bottom__text type-garamond-regular font-size-extralarge">
                    {`– ${formatedSiteName}`}
                </h2>
            </div>
        </>
    )
}
