import React, { useEffect, useRef } from 'react'

import { PhotoData } from 'src/types'

export const BREAKPOINTS = {
    mobile: 800,
}

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

export function useDebounce<T extends (...args: any[]) => any>(
    callBack: T,
    debounceTime: number,
) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

    useEffect(
        () => () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        },
        [],
    )

    const debouncedFunc = (...args: any[]) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            callBack(...args)
        }, debounceTime)
    }

    return {
        func: debouncedFunc as T,
        cancel: () => timeoutRef.current && clearTimeout(timeoutRef.current),
    }
}

export function moveToIndex(
    array: PhotoData[],
    old_index: number,
    new_index: number,
) {
    const _array = [...array]
    const element = _array[old_index]
    _array.splice(old_index, 1)
    _array.splice(new_index, 0, element)
    return _array
}

export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = React.useState({
        width: window.innerWidth,
        height: window.innerHeight,
    })

    React.useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return windowDimensions
}
