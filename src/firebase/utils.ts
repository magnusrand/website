export const META_DATA_FIELDS = [
    'Make',
    'Model',
    'XResolution',
    'YResolution',
    'ResolutionUnit',
    'Software',
    'ModifyDate',
    'Artist',
    'ExposureTime',
    'FNumber',
    'ExposureProgram',
    'ISO',
    'SensitivityType',
    'RecommendedExposureIndex',
    'ExifVersion',
    'DateTimeOriginal',
    'CreateDate',
    'OffsetTime',
    'ShutterSpeedValue',
    'ApertureValue',
    'ExposureCompensation',
    'MaxApertureValue',
    'MeteringMode',
    'Flash',
    'FocalLength',
    'SubSecTimeOriginal',
    'SubSecTimeDigitized',
    'ColorSpace',
    'ExifImageWidth',
    'ExifImageHeight',
    'FocalPlaneXResolution',
    'FocalPlaneYResolution',
    'FocalPlaneResolutionUnit',
    'CustomRendered',
    'ExposureMode',
    'WhiteBalance',
    'SceneCaptureType',
    'ImageUniqueID',
    'SerialNumber',
    'LensInfo',
    'LensModel',
    'LensSerialNumber',
]

export function formatDescriptionForFirestore(description: string | undefined) {
    return description?.replaceAll(/(?:\r\n|\r|\n)/g, '#NEWLINE#') ?? ''
}
export function formatDescriptionForDisplay(description: string | undefined) {
    return description?.replaceAll('#NEWLINE#', '\n') ?? ''
}
export function formatDescriptionForHTML(description: string | undefined) {
    if (description === undefined) return ''
    return description
        .replaceAll(/\*\*(\S.+\S)\*\*/g, '<strong>$1</strong>')
        .replaceAll(/(\s)\*(\S.+\S)\*(\s)/g, '$1<em>$2</em>$3')
        .replaceAll(/^#\s(.+?)(#NEWLINE#)/g, '<h3>$1</h3>$2<p>')
        .replaceAll(/^##\s(.+?)(#NEWLINE#)/g, '<h4>$1</h4>$2<p>')
        .replaceAll('#NEWLINE##NEWLINE#', '</p><p>')
        .replaceAll('#NEWLINE#', '\n')
        .replaceAll(/^([^<])/g, '<p>$1')
}
