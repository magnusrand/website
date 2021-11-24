import React from 'react'

export const VisualBackgroundGrid = () => {
    const columnItems = Array.from({ length: 6 }, (v, index) => index)
    const rowItems = Array.from({ length: 12 }, (v, index) => index)

    return (
        <div className="background-grid">
            <div className="container">
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
        </div>
    )
}

export default VisualBackgroundGrid
