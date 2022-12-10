import React from 'react';
import {HashRouter, Routes, Route, Link} from 'react-router-dom';
import {createRoot} from 'react-dom/client';
import Home from './pages/Home';
import Project from './pages/Project';

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js');
};

const App = () => {
    return (
        <HashRouter>
            <Routes>
                <Route index element={<Home />} />
                <Route path=':id' element={<Project />} />
            </Routes>
        </HashRouter>
    );
}

const root = createRoot(document.getElementById('app') as HTMLElement);
root.render(<App />);