import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-content">
            <Link to="/" className="logo-link">
              Share2Teach
            </Link>
            <nav className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/mathematics">Mathematics</Link>
              <Link to="/business-studies">Business Studies</Link>
              <Link to="/history">History</Link>
              <Link to="/geography">Geography</Link>
              <Link to="/natural-science">Natural Science</Link>
              <Link to="/life-science">Life Science</Link>
              <Link to="/english">English</Link>
              <Link to="/technology">Technology</Link>
              <Link to="/afrikaans">Afrikaans</Link>
              <Link to="/life-skills">Life Skills</Link>
              <Link to="/computer-science">Computer Science</Link>
              <Link to="/other-oers">Other useful OER's</Link>
              <Link to="/self-directed-learning">Self-Directed Learning</Link>
              <Link to="/contributors">Contributors</Link>
              <Link to="/about-us">About Us</Link>
            </nav>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <button>Search</button>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Add more routes for other subjects here */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
