import {
    getCameraName,
    getAperture,
    getShutterSpeedFraction,
    getISO,
} from '@components/utils'
import { IoMdAperture, IoMdStopwatch } from 'react-icons/io'
import { MdIso, MdCameraAlt } from 'react-icons/md'
import { PhotoData } from 'src/types'

export function MetaText({ photo }: { photo: PhotoData | null }) {
    if (!photo) return null

    const cameraName = getCameraName(photo)
    const aperture = getAperture(photo?.metaData?.FNumber)
    const shutterspeed = getShutterSpeedFraction(photo?.metaData?.ExposureTime)
    const iso = getISO(photo?.metaData?.ISO)

    return (
        <small className="shop-frame__metatext">
            {aperture && (
                <>
                    <IoMdAperture /> {aperture}
                </>
            )}
            {shutterspeed && (
                <>
                    <IoMdStopwatch style={{ marginLeft: '0.5rem' }} />
                    {shutterspeed}
                </>
            )}
            {iso && (
                <>
                    <MdIso style={{ marginLeft: '0.5rem' }} /> {iso}
                </>
            )}
            {cameraName && (
                <>
                    <MdCameraAlt style={{ marginLeft: '0.5rem' }} />
                    {cameraName}
                </>
            )}
        </small>
    )
}
