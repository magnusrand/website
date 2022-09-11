import React, { useState } from 'react'

// import { wrapGrid } from 'animate-css-grid'
import { createPhotosInAlbum, getPhotosInAlbum } from '../../firebase/firebase'

import './photographypages-styles.css'

export const AddPhotos = () => {
    const [albumValue, setAlbumValue] = useState('')
    const [linkValue, setLinkValue] = useState('')
    const [nameValue, setNameValue] = useState('')

    const handleClickAddPhotos = () => {
        console.log('click')

        // alert(`The name you entered was: ${inputValue}`)
        createPhotosInAlbum(linkValue, albumValue, nameValue)
        //getPhotos()
    }

    return (
        <div className="main-grid add-photos">
            <h1>{albumValue}</h1>

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
            <button onClick={handleClickAddPhotos}>Tyrkk</button>
        </div>
    )
}

export default AddPhotos
