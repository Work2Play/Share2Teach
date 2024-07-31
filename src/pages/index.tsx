import * as React from "react"
import { Link } from 'gatsby'
import 'C:\\Users\\ukmak\\Documents\\Share2Teach\\share2tech\\src\\styles\\index.css';

const pageStyles = {
    color: "#232129",
    padding: 96,
    fontFamily: "-apple-system, Roboto, sans-serif, serif",
  }
  
const IndexPage: React.FC = () => {
    return (
        <main style={pageStyles}>
          <div className="home">
            <div className="hero-image">
                <h1>Share2Teach</h1>
                <p>Open Educational Resources</p>
                <button>Contribute Resources</button>
            </div>
            <div className="subject-gallery">
                <div className="subject-card">
                    <Link to="/math">Mathematics</Link>
                </div>
                <div className="subject-card">
                    <Link to="/businessStudies">Business Studies</Link>
                </div>
                <div className="subject-card">
                    <Link to="/history">History</Link>
                </div>
                <div className="subject-card">
                    <Link to="/geography">Geography</Link>
                </div>
                <div className="subject-card">
                    <Link to="/lifeScience">Life Science</Link>
                </div>
                <div className="subject-card">
                    <Link to="/naturalScience">Natural Science</Link>
                </div>
                <div className="subject-card">
                    <Link to="/english">English</Link>
                </div>
                <div className="subject-card">
                    <Link to="/technology">Technology</Link>
                </div>
                <div className="subject-card">
                    <Link to="/afrikaans">Afrikaans</Link>
                </div>
                <div className="subject-card">
                    <Link to="/lifeSkills">Life Skills</Link>
                </div>
                <div className="subject-card">
                    <Link to="/computerScience">Computer Science</Link>
                </div>
                <div className="subject-card">
                    <Link to="/other-oers">Other useful OER's</Link>
                </div>
                <div className="subject-card">
                    <Link to="/self-directed-learning">Self-Directed Learning</Link>
                </div>
                <div className="subject-card">
                    <Link to="/collaborators">Collaborators</Link>
                </div>
                <div className="subject-card">
                    <Link to="/about-us">About Us</Link>
                </div>
            </div>
        </div>
        </main>        
    );
};

export default IndexPage;

export const Head: React.FC = () => <title>Home Page</title>;