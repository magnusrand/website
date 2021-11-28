import React, { useEffect } from 'react'

interface Props {
    linkPath: string
}

export const Redirect = ({ linkPath }: Props) => {
    useEffect(() => {
        window.location.replace(linkPath)
    }, [])

    return null
}

export default Redirect
