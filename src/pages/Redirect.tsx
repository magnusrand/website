import { useEffect } from 'react'

interface Props {
    linkPath: string
}

export const Redirect = ({ linkPath }: Props) => {
    useEffect(() => {
        window.location.replace(linkPath)
    }, [linkPath])

    return null
}

export default Redirect
