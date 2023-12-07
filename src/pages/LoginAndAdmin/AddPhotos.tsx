import React, { useState } from 'react'

import { useAuth } from '../../firebase/firebase-auth'

// import { createPhotosInAlbum } from '../../firebase/firebase-firestore'

import './styles.css'

export const AddPhotos = () => {
    const [albumValue, setAlbumValue] = useState('')
    const [linkValue, setLinkValue] = useState('')
    const [nameValue, setNameValue] = useState('')
    const [loadingPhotos] = useState(false)

    const user = useAuth()

    const handleClickAddPhotos = async () => {
        alert(`Ikke implementert!`)

        // try {
        //     setLoadingPhotos(true)
        //     const numberOfPhotosAdded = await createPhotosInAlbum(
        //         linkValue,
        //         albumValue,
        //         nameValue,
        //     )
        //     setLoadingPhotos(false)
        //     alert(
        //         `${
        //             numberOfPhotosAdded > 0 ? numberOfPhotosAdded : 'Ingen'
        //         } bilder ble lagt til i albumet ${albumValue} i firestore!`,
        //     )
        //     setAlbumValue('')
        //     setLinkValue('')
        //     setNameValue('')
        // } catch {
        //     alert(`Noe gikk galt, sjekk konsollen`)
        // }
    }

    return (
        <div className="main-grid add-photos">
            <p>Logged in as: {user ? user.email : 'Not logged in'}</p>
            <div>
                <label>
                    Navn på album: {albumValue}
                    <input
                        type="text"
                        value={albumValue}
                        onChange={(e) => setAlbumValue(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Link til bilde: {linkValue}
                    <input
                        type="text"
                        value={linkValue}
                        onChange={(e) => setLinkValue(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Navn på bilde: {nameValue}
                    <input
                        type="text"
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                    />
                </label>
            </div>
            <button onClick={handleClickAddPhotos} disabled={loadingPhotos}>
                {loadingPhotos ? 'Laster …' : 'Legg til'}
            </button>
        </div>
    )
}

export default AddPhotos
