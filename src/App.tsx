import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'

import VisualBackgroundGrid from './components/BackgroundGrid'

import './main-styles.css'
import { LandingPage } from './pages/LandingPage'
import Redirect from './pages/Redirect'

const App = () => {
    return (
        <BrowserRouter>
            <div className="app">
                <VisualBackgroundGrid
                    numberOfRows={Math.ceil(window.innerHeight / (10.5 * 16))}
                    visible={true}
                />
                <div className="main-grid">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/dritt" element={<h1>hahahahaha</h1>} />
                        <Route
                            path="/github"
                            element={
                                <Redirect linkPath="https://github.com/magnusrand" />
                            }
                        />
                        <Route path="*" element={<h1>404 – Not found </h1>} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App
