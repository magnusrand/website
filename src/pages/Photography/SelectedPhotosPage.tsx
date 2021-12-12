import React, { useEffect, useState } from 'react'

import {
    NavBar,
    NavItem,
    Dropdown,
    DropdownItem,
} from '../../components/NavBar/NavBar'
import { getPhoto, getPhotosInAlbum } from '../../firebase/firebase'
import { Color, PhotoData } from '../../types'

export const SelectedPhotosPage = () => {
    const [photoLinks, setPhotoLinks] = useState<PhotoData[]>()
    useEffect(() => {
        const getPhotosLink = async () => {
            const photoLinkData = await getPhotosInAlbum('Utvalgte')
            setPhotoLinks(photoLinkData ?? [])
        }
        getPhotosLink()
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
            {photoLinks?.map((photo) => (
                <img src={photo.link + '=w1000'} width={'100%'} />
            ))}
        </div>
    )
}

export default SelectedPhotosPage
