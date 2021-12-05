import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'

import VisualBackgroundGrid from './components/BackgroundGrid'

import { LandingPage } from './pages/LandingPage/LandingPage'
import Redirect from './pages/Redirect'

import './main-styles.css'
import SelectedPhotosPage from './pages/Photography/SelectedPhotosPage'
import AddPhotos from './pages/Photography/AddPhotos'

const App = () => (
    <BrowserRouter>
        <div className="app">
            <VisualBackgroundGrid
                numberOfRows={Math.ceil(window.innerHeight / (10.5 * 16))}
                numberOfColumns={3}
                visible={true}
            />

            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dritt" element={<SelectedPhotosPage />} />
                <Route
                    path="/github"
                    element={
                        <Redirect linkPath="https://github.com/magnusrand" />
                    }
                />
                <Route path="/add-photos" element={<AddPhotos />} />
                <Route path="*" element={<h1>404 – Not found </h1>} />
            </Routes>
        </div>
    </BrowserRouter>
)

export default App
