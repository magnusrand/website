import React from 'react'
import VisualBackgroundGrid from './components/BackgroundGrid'
import { NavBar, NavItem } from './components/NavBar/NavBar'

import './main-styles.css'

const App = () => {
    return (
        <div className="app">
            <VisualBackgroundGrid
                numberOfRows={Math.ceil(window.innerHeight / (10.5 * 16))}
                visible={true}
            />
            <div className="main-grid">
                <NavBar>
                    <NavItem title="Fotografi" />
                    <NavItem title="GitHub" />
                    <NavItem title="Om meg" />
                </NavBar>
                <div className="main-content">main-content</div>
                <div className="horizontal-bar1"></div>
                <div className="horizontal-bar2"></div>
                <div className="horizontal-bar3"></div>
            </div>
        </div>
    )
}

export default App
