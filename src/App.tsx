import React from 'react'
import { Route, BrowserRouter, Routes, Link } from 'react-router-dom'

import VisualBackgroundGrid from './components/BackgroundGrid'

import { LandingPage } from './pages/LandingPage/LandingPage'
import Redirect from './pages/Redirect'

import './main-styles.css'
import AddPhotos from './pages/Photography/AddPhotos'
import DisplayPhotosPage from './pages/Photography/DisplayPhotosPage'

const App = () => (
    <BrowserRouter>
        <div className="app">
            <VisualBackgroundGrid
                numberOfRows={Math.ceil(window.innerHeight / (10.5 * 16))}
                numberOfColumns={3}
                visible={false}
            />

            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="foto" element={<h1>Under construction</h1>} />
                <Route path="foto/:albumName" element={<DisplayPhotosPage />} />
                <Route
                    path="/github"
                    element={
                        <Redirect linkPath="https://github.com/magnusrand" />
                    }
                />
                <Route path="add-photos" element={<AddPhotos />} />
                <Route
                    path="*"
                    element={
                        <div>
                            <h1>404 – Not found </h1>
                            <img src="https://c.tenor.com/_BiwWBWhYucAAAAd/what-huh.gif" />
                            <Link to="/">
                                <a>Ta meg til startsiden</a>
                            </Link>
                        </div>
                    }
                />
            </Routes>
        </div>
    </BrowserRouter>
)

export default App
