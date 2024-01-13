export function getShutterSpeedFraction(value: number | undefined) {
    if (value === undefined) return ''

    const denominator = Math.round(1 / value)

    if (denominator < 1) return `${value}S`

    return `1/${denominator}S`
}

export function getAperture(value: number | undefined) {
    if (value === undefined) return ''

    return `f/${value}`
}

export function getISO(value: number | undefined) {
    if (value === undefined) return ''

    return 'ISO ' + value
}
