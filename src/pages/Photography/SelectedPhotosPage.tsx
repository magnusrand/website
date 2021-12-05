import React, { useEffect, useState } from 'react'

import {
    NavBar,
    NavItem,
    Dropdown,
    DropdownItem,
} from '../../components/NavBar/NavBar'
import { getPhoto } from '../../firebase/firebase'
import { Color } from '../../types'

export const SelectedPhotosPage = () => {
    const [photoLink, setPhotoLink] = useState<string>('')
    useEffect(() => {
        const getPhotoLink = async () => {
            const photoLinkData = await getPhoto()
            setPhotoLink(photoLinkData)
        }
        getPhotoLink()
    }, [])

    return (
        <div className="main-grid selected-photos-page">
            <NavBar>
                <NavItem title="Fotografi" color={Color.DARK1}>
                    <Dropdown>
                        <DropdownItem title="Utvalgte" linkPath="dritt" />
                        <DropdownItem title="Alle bilder" linkPath="" />
                    </Dropdown>
                </NavItem>
                <NavItem
                    title="GitHub"
                    color={Color.DARK2}
                    expandIcon={false}
                    linkPath="/github"
                />
                <NavItem title="Annet" color={Color.DARK3}>
                    <Dropdown>
                        <DropdownItem title="CV" linkPath="" />
                        <DropdownItem title="Kontakt meg" linkPath="" />
                    </Dropdown>
                </NavItem>
            </NavBar>
            {/* <h1>{photoLink}</h1> */}
            <img src={photoLink + '=w500'} width={'100%'} />
            <img src={photoLink + '=w500'} width={'100%'} />
            <img src={photoLink + '=w500'} width={'100%'} />
            <img src={photoLink + '=w500'} width={'100%'} />
            <img src={photoLink + '=w500'} width={'100%'} />
            <img src={photoLink + '=w500'} width={'100%'} />
            <img src={photoLink + '=w500'} width={'100%'} />
        </div>
    )
}

export default SelectedPhotosPage
