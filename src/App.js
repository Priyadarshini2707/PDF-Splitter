import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import Splitter from './components/Splitter';
import Rearranger from './components/Rearranger';
import Rotator from './components/Rotator';

function App() {
  return (
    <Router>
      <div>
        <div className="top-bar">
          <div className="title">PDF Tools: Split, Rearrange, Rotate</div>
        </div>
        <div style={{ marginTop: '20px' }}></div>
        <nav>
          <ul className="buttons">
            <li>
              <Link to="/splitter" className="button">Split Files</Link>
            </li>
            <li>
              <Link to="/rearranger" className="button">Rearrange Files</Link>
            </li>
            <li>
              <Link to="/rotator" className="button">Rotate Files</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Splitter />} />
          <Route path="/splitter" element={<Splitter />} />
          <Route path="/rearranger" element={<Rearranger />} />
          <Route path="/rotator" element={<Rotator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
