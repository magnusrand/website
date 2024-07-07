import { DocumentReference } from 'firebase/firestore'

export enum Color {
    DARK1 = '--dark-color-1',
    DARK2 = '--dark-color-2',
    DARK3 = '--dark-color-3',
    LIGHT1 = '--light-color-1',
    LIGHT2 = '--light-color-2',
    LIGHT3 = '--light-color-3',
}

export interface AlbumData {
    name: string
    coverPhotoUrl: string
    numberOfPhotos: number
    documentRef: DocumentReference
}

export interface PhotoData {
    title?: string
    description?: string
    fileName: string
    imageUrl: string
    downloadUrl: string
    priority: number
    thumbnailUrl: string
    metaData?: metaData
    documentRef: DocumentReference
}

export interface metaData {
    Make?: string
    Model?: string
    XResolution?: number
    YResolution?: number
    ResolutionUnit?: string | number
    Software?: string
    ModifyDate?: Date
    Artist?: string
    ExposureTime?: number
    FNumber?: number
    ExposureProgram?: string
    ISO?: number
    SensitivityType?: number
    RecommendedExposureIndex?: number
    ExifVersion?: string
    DateTimeOriginal?: Date
    CreateDate?: Date
    OffsetTime?: string
    ShutterSpeedValue?: number
    ApertureValue?: number
    ExposureCompensation?: number
    MaxApertureValue?: number
    MeteringMode?: string
    Flash?: string
    FocalLength?: number
    SubSecTimeOriginal?: string
    SubSecTimeDigitized?: string
    ColorSpace?: number
    ExifImageWidth?: number
    ExifImageHeight?: number
    FocalPlaneXResolution?: number
    FocalPlaneYResolution?: number
    FocalPlaneResolutionUnit?: string
    CustomRendered?: string
    ExposureMode?: string
    WhiteBalance?: string
    SceneCaptureType?: string
    ImageUniqueID?: string
    SerialNumber?: string
    LensInfo?: Array<Record<number, number>>
    LensModel?: string
    LensSerialNumber?: string
    orientation?: string
}
