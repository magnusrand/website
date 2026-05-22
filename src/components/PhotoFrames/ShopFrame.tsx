import { useEffect, useState } from "react";
import { ProgressiveImage } from "./ProgressiveImage";
import { getPhotosInAlbum } from "@firebase-utils/firebase-firestore";
import { PhotoData } from "src/types";

export function ShopFrame(props: { photo: PhotoData }) {
    return (
        <div className="shop-frame">
            <ProgressiveImage />
            HEI
            <div className="shop-frame__info">

            </div>
        </div>
    )
}