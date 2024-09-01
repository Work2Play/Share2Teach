import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link,} from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop'; // Import ScrollToTop component
import Home from './pages/HomePage/Home';
import MathPage from './pages/MathPage/MathPage';
import BusinessStudiesPage from './pages/BusinessStudiesPage/BusinessStudiesPage';
import HistoryPage from './pages/HistoryPage/HistoryPage';
import GeographyPage from './pages/GeographyPage/GeographyPage';
import NaturalSciencePage from './pages/NaturalSciencePage/NaturalSciencePage';
import LifeSciencePage from './pages/LifeSciencePage/LifeSciencePage';
import EnglishPage from './pages/EnglishPage/EnglishPage';
import TechnologyPage from './pages/TechnologyPage/TechnologyPage';
import AfrikaansPage from './pages/AfrikaansPage/AfrikaansPage';
import LifeSkillsPage from './pages/LifeSkillsPage/LifeSkillsPage';
import ComputerSciencePage from './pages/ComputerSciencePage/ComputerSciencePage';
import OtherOERsPage from './pages/OtherOERsPage/OtherOERsPage';
import SelfDirectedLearningPage from './pages/SelfDirectedLearningPage/SelfDirectedLearningPage';
import ContributorsPage from './pages/ContributorsPage/ContributorsPage';
import AboutUsPage from './pages/AboutUsPage/AboutUsPage';
import FAQPage from './FAQPage';
import SearchComponent from './components/SearchComponent';
import SearchResultsPage from './pages/SearchPage/SearchResultsPage';
import RoleAssign from './pages/RoleAssignPage/RoleAssign';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import SignInPage from './pages/SignInPage/SignInPage';
import { AuthContext } from './components/auth';



// Adding auth for the login and logout button view
import { Auth } from './components/auth';
import CCImage from './Images/CC.png';
import { Upload } from './components/fileupload';



function App() {
  // State to manage the visibility of the menu
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);

  // Toggle the menu visibility
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);

    
  };

  // Handle mouse enter event to keep the menu open
  const handleMouseEnter = () => {
    setHovering(true);
  };

  // Handle mouse leave event to close the menu after a delay
  const handleMouseLeave = () => {
    setHovering(false);
  };

  // Close the menu if not hovering over it
  useEffect(() => {
    if (!hovering) {
      const timer = setTimeout(() => setMenuOpen(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [hovering]);


  return (
    <Router>
      <ScrollToTop /> {/* Add ScrollToTop here */}
      <div className="App">
        <header className="App-header">
          <div className="header-left">
            {/* Menu button to toggle the dropdown menu */}
            <button className="menu-button" onClick={toggleMenu}>
              Menu
            </button>
            {menuOpen && (
              <nav
                className="dropdown-menu"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <ul className="nav-links">
                  <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
                  <li><Link to="/mathematics" onClick={() => setMenuOpen(false)}>Mathematics</Link></li>
                  <li><Link to="/business-studies" onClick={() => setMenuOpen(false)}>Business Studies</Link></li>
                  <li><Link to="/history" onClick={() => setMenuOpen(false)}>History</Link></li>
                  <li><Link to="/geography" onClick={() => setMenuOpen(false)}>Geography</Link></li>
                  <li><Link to="/natural-science" onClick={() => setMenuOpen(false)}>Natural Science</Link></li>
                  <li><Link to="/life-science" onClick={() => setMenuOpen(false)}>Life Science</Link></li>
                  <li><Link to="/english" onClick={() => setMenuOpen(false)}>English</Link></li>
                  <li><Link to="/technology" onClick={() => setMenuOpen(false)}>Technology</Link></li>
                  <li><Link to="/afrikaans" onClick={() => setMenuOpen(false)}>Afrikaans</Link></li>
                  <li><Link to="/life-skills" onClick={() => setMenuOpen(false)}>Life Skills</Link></li>
                  <li><Link to="/computer-science" onClick={() => setMenuOpen(false)}>Computer Science</Link></li>
                  <li><Link to="/other-oers" onClick={() => setMenuOpen(false)}>Other useful OER's</Link></li>
                  <li><Link to="/self-directed-learning" onClick={() => setMenuOpen(false)}>Self-Directed Learning</Link></li>
                  <li><Link to="/contributors" onClick={() => setMenuOpen(false)}>Contributors</Link></li>
                  <li><Link to="/about-us" onClick={() => setMenuOpen(false)}>About Us</Link></li>
                    <li><Link to="/role-assign" onClick={() => setMenuOpen(false)}>Role Assign</Link></li>
                </ul>
              </nav>
            )}
          </div>
          
          {/* Title of the website */}
          <h1 className="logo-title">Share2Teach</h1>

          <div className="header-right">
            
              <div className="header-center">
                <SearchComponent />
              </div>
            <button onClick={() => setFaqOpen(true)} className="faq-button">FAQ</button>
            
            <Auth />
          </div>
        </header>
        <main className="main-content">
          <Routes>
            {/* Define routes for the different pages */}
            <Route path="/" element={<Home />} />
            <Route path="/mathematics" element={<MathPage />} />
            <Route path="/business-studies" element={<BusinessStudiesPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/geography" element={<GeographyPage />} />
            <Route path="/natural-science" element={<NaturalSciencePage />} />
            <Route path="/life-science" element={<LifeSciencePage />} />
            <Route path="/english" element={<EnglishPage />} />
            <Route path="/technology" element={<TechnologyPage />} />
            <Route path="/afrikaans" element={<AfrikaansPage />} />
            <Route path="/life-skills" element={<LifeSkillsPage />} />
            <Route path="/computer-science" element={<ComputerSciencePage />} />
            <Route path="/other-oers" element={<OtherOERsPage />} />
            <Route path="/self-directed-learning" element={<SelfDirectedLearningPage />} />
            <Route path="/contributors" element={<ContributorsPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/role-assign" element={<RoleAssign />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            {/* Add more routes for other subjects here */}
          </Routes>
          <FAQPage isOpen={faqOpen} onClose={() => setFaqOpen(false)} />
          <footer className="footer">
            <div className="footer-content">
              <img src={CCImage} alt="Creative Commons License" className="cc-image" />
              <div className="disclaimer">
                <p><strong>Disclaimer:</strong></p>
                <p>
                  The resources available on this website are primarily the work of students. While we strive to maintain a high standard of quality, we cannot guarantee the accuracy, reliability, or completeness of the content provided. Users are encouraged to critically evaluate the materials and adopt them at their own discretion. Neither the founders nor North-West University assume responsibility for any errors, omissions, or for the results obtained from the use of this information. Design images are generated by ChatGPT (Open AI, 2023).
                </p>
              </div>
              <div className="reference">
                <p><strong>Reference:</strong></p>
                <p>
                  OpenAI. (2023). <em>ChatGPT (Mar 14 version)</em> [Large language model]. <a href="https://chat.openai.com/chat">https://chat.openai.com/chat</a>
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </Router>
  );
}

export default App;
