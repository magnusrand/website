export enum Color {
    DARK1 = '--dark-color-1',
    DARK2 = '--dark-color-2',
    DARK3 = '--dark-color-3',
    LIGHT1 = '--light-color-1',
    LIGHT2 = '--light-color-2',
    LIGHT3 = '--light-color-3',
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
}

interface metaData {
    Make?: string | number
    Model?: string | number
    XResolution?: string | number
    YResolution?: string | number
    ResolutionUnit?: string | number
    Software?: string | number
    ModifyDate?: string | number
    Artist?: string | number
    ExposureTime?: string | number
    FNumber?: string | number
    ExposureProgram?: string | number
    ISO?: string | number
    SensitivityType?: string | number
    RecommendedExposureIndex?: string | number
    ExifVersion?: string | number
    DateTimeOriginal?: string | number
    CreateDate?: string | number
    OffsetTime?: string | number
    ShutterSpeedValue?: string | number
    ApertureValue?: string | number
    ExposureCompensation?: string | number
    MaxApertureValue?: string | number
    MeteringMode?: string | number
    Flash?: string | number
    FocalLength?: string | number
    SubSecTimeOriginal?: string | number
    SubSecTimeDigitized?: string | number
    ColorSpace?: string | number
    ExifImageWidth?: string | number
    ExifImageHeight?: string | number
    FocalPlaneXResolution?: string | number
    FocalPlaneYResolution?: string | number
    FocalPlaneResolutionUnit?: string | number
    CustomRendered?: string | number
    ExposureMode?: string | number
    WhiteBalance?: string | number
    SceneCaptureType?: string | number
    ImageUniqueID?: string | number
    SerialNumber?: string | number
    LensInfo?: string | number
    LensModel?: string | number
    LensSerialNumber?: string | number
    orientation?: string
}
