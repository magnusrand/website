import { PhotoData } from 'src/types'

import { ProgressiveImage } from './ProgressiveImage'
import './shopFrame.css'

export function ShopFrame(props: { photo: PhotoData }) {
    return (
        <div className="shop-frame">
            <ProgressiveImage
                src={props.photo.imageUrl}
                placeholderSrc={props.photo.thumbnailUrl}
            />
            <div className="shop-frame__info">test</div>
        </div>
    )
}
