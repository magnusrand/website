/* eslint import/order: 0 */
import React from 'react'
import { Route, BrowserRouter, Routes, Link } from 'react-router-dom'

import './main-styles.css'

import { LandingPage } from '@pages/LandingPage/LandingPage'
import { DisplayPhotosPage } from '@pages/Photography/DisplayPhotosPage'
import { LogIn } from '@pages/LoginAndAdmin/LogIn'
import { FeaturedPhotosPage } from '@pages/Photography/FeaturedPhotos/FeaturedPhotosPage'
import { AlbumsPage } from '@pages/Photography/Albums/AlbumsPage'
import { EditAlbum } from '@pages/EditAlbum/EditAlbum'
import { TagsPage } from '@pages/Photography/Search/TagsPage'

import { Redirect } from '@components/Redirect'
import { VisualBackgroundGrid } from '@components/BackgroundGrid'

export const App = () => (
    <BrowserRouter>
        <div className="app">
            <VisualBackgroundGrid
                numberOfRows={Math.ceil(window.innerHeight / (10.5 * 16))}
                numberOfColumns={3}
                visible={false}
            />

            <Routes>
                <Route index element={<LandingPage />} />
                <Route path="admin" element={<EditAlbum />} />
                <Route path="foto/album" element={<AlbumsPage />} />
                <Route path="foto/etiketter/:photo" element={<TagsPage />} />
                <Route path="foto/etiketter" element={<TagsPage />} />
                <Route
                    path="foto/utvalgte/:photo"
                    element={<FeaturedPhotosPage />}
                />
                <Route path="foto/utvalgte" element={<FeaturedPhotosPage />} />
                <Route
                    path="foto/album/:albumName/:photo"
                    element={<DisplayPhotosPage />}
                />
                <Route
                    path="foto/album/:albumName"
                    element={<DisplayPhotosPage />}
                />
                <Route
                    path="github"
                    element={
                        <Redirect linkPath="https://github.com/magnusrand" />
                    }
                />
                <Route
                    path="linkedin"
                    element={
                        <Redirect linkPath="https://www.linkedin.com/in/magnus-rand-363489122/" />
                    }
                />
                <Route
                    path="musikk"
                    element={
                        <Redirect linkPath="https://soundcloud.com/magnus-rand" />
                    }
                />
                <Route path="login" element={<LogIn />} />
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
