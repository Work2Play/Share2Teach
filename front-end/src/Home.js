import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
    return (
    <div className="home">
        <div className="hero-image">
        <h1>Share2Teach</h1>
        <p>Open Educational Resources</p>
        <button>Contribute Resources</button>
        </div>
        <div className="subject-gallery">
        <div className="subject-card">
            <Link to="/mathematics">Mathematics</Link>
        </div>
        <div className="subject-card">
            <Link to="/business-studies">Business Studies</Link>
        </div>
        <div className="subject-card">
            <Link to="/history">History</Link>
        </div>
        <div className="subject-card">
            <Link to="/geography">Geography</Link>
        </div>
        <div className="subject-card">
            <Link to="/life-science">Life Science</Link>
        </div>
        <div className="subject-card">
            <Link to="/natural-science">Natural Science</Link>
        </div>
        </div>
    </div>
    );
}

export default Home;
