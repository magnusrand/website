
import { useEffect, useState } from "react";
import { getPhotosInAlbum } from "@firebase-utils/firebase-firestore";
import { SiteHeading } from "@components/SiteHeading/SiteHeading";
import { ShopFrame } from "@components/PhotoFrames/ShopFrame";
import { PhotoData } from "src/types";
import "./printShop.css";

export function PrintShop(props: {}) {
    const [photos, setPhotos] = useState<PhotoData[]>()

    useEffect(function getPrints() {
        async function fetchPrintPhotos() {
            const result = await getPhotosInAlbum("prints");
            if (result) setPhotos(result)
                
            console.log(result)
        }
        fetchPrintPhotos()
    },[])
    
    return (
        <div className="print-shop main-grid">
            <SiteHeading siteName="Butikk" />
            {photos?.map(photo => (
                <ShopFrame photo={photo} />
            ))}
        </div>
    )
}