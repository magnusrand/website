import React from 'react'

interface Props {
    visible?: boolean
    numberOfRows?: number
    numberOfColumns?: number
}

export const VisualBackgroundGrid = ({
    visible = true,
    numberOfRows = 8,
    numberOfColumns = 6,
}: Props) => {
    const columnItems = Array.from(
        { length: numberOfColumns },
        (v, index) => index,
    )
    const rowItems = Array.from({ length: numberOfRows }, (v, index) => index)

    return visible ? (
        <div className="visual-background-grid">
            <div className="column-container">
                {columnItems.map((item) => (
                    <div key={item} className="column" />
                ))}
            </div>
            <div className="row-container">
                {rowItems.map((item) => (
                    <div key={item} className="row" />
                ))}
            </div>
        </div>
    ) : (
        <></>
    )
}
