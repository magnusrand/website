import React from 'react'
import VisualBackgroundGrid from './components/BackgroundGrid'
import {
    Dropdown,
    DropdownItem,
    NavBar,
    NavItem,
} from './components/NavBar/NavBar'

import './main-styles.css'
import { Color } from './types'

const App = () => {
    return (
        <div className="app">
            {/* <VisualBackgroundGrid
                numberOfRows={Math.ceil(window.innerHeight / (10.5 * 16))}
                visible={true}
            /> */}
            <div className="main-grid">
                <NavBar>
                    <NavItem title="Fotografi" color={Color.DARK1}>
                        <Dropdown>
                            <DropdownItem title={'item'} linkPath={'#'} />
                            <DropdownItem title={'item2'} linkPath={'#'} />
                            <DropdownItem title={'item3'} linkPath={'#'} />
                        </Dropdown>
                    </NavItem>
                    <NavItem
                        title="GitHub"
                        color={Color.DARK2}
                        expandIcon={false}
                    />
                    <NavItem title="Om meg" color={Color.DARK3} />
                </NavBar>
                <div className="main-content"></div>
                <div className="horizontal-bar1"></div>
                <div className="horizontal-bar2"></div>
                <div className="horizontal-bar3"></div>
            </div>
        </div>
    )
}

export default App
