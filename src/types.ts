export enum Color {
    DARK1 = '--dark-color-1',
    DARK2 = '--dark-color-2',
    DARK3 = '--dark-color-3',
    LIGHT1 = '--light-color-1',
    LIGHT2 = '--light-color-2',
    LIGHT3 = '--light-color-3',
}

export interface PhotoData {
    link: string
    name: string
    meta?: metaData
}

interface metaData {
    height: number
    width: number
    orientation: 'portrait' | 'landscape'
}
