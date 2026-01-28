import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ActiveGame } from './pages/ActiveGameModern';
import './styles/design-tokens.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game" element={<ActiveGame />} />
            </Routes>
        </Router>
    );
}

export default App;
