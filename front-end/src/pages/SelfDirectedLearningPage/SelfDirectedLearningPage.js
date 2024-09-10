import React from 'react';
import './SelfDirectedLearningPage.css';
import SDLImage from '../../Images/SDL_image.png';
import InnovativeCurriculum from '../../Images/Innovative_curriculum.png';
import PB_Learning from '../../Images/PB_learning.png';
import ContextualisedPractices from '../../Images/Contextualised_practices.png';
import Covid19 from '../../Images/Covid19.png';
import LearningAssessment from '../../Images/Learning_assesment.png';
import BlendedLearning from '../../Images/Blended_learning.png';
import BecomingTeacher from '../../Images/Becoming_teacher.png';
import SelfDirectedLearning from '../../Images/Self-directed_learning.png';
import SelfDirectedComplex from '../../Images/Self-directed_complex.png';
import SelfDirected21st from '../../Images/Self-directed_21st.png';
import SelfDirectedImpact from '../../Images/Self-directed_impact.png';
import DecolonisationCP from '../../Images/Decolonisation_CP.png';
import SDLWebBanner from '../../Images/SDL-WebBanner-2B.jpg'; // Adjusted the file name

function SelfDirectedLearningPage() {
    return (
        <div className="self-directed-learning-page">
            <h1 className="subject-title">Self-directed Learning</h1>
            <h2 className="section-subtitle">NWU Research Unit Self-Directed Learning</h2>
            <div className="subject-introduction">
            <a href="https://education.nwu.ac.za/research-unit-self-directed-learning/home" target="_blank" rel="noopener noreferrer">
                <img src={SDLImage} alt="SDL" className="main-image"/>
            </a>
            </div>
            <h2 className="section-subtitle">AOSIS NWU Self-Directed Learning book series</h2>
            <p>Download the books for free from the AOSIS Website (Links on pictures below)</p>
            <div className="book-gallery">
            <div className="book-item">
                <a href="https://aosis.co.za/portfolio/innovative-curriculum-design-bridging-the-theory-practice-divide-in-work-integrated-learning-to-foster-self-directed-learning/" target="_blank" rel="noopener noreferrer">
                <img src={InnovativeCurriculum} alt="Innovative Curriculum" />
                </a>
                <p>Innovative curriculum design: Bridging the theory–practice divide in work-integrated learning to foster Self-Directed Learning</p>
            </div>
            <div className="book-item">
                <a href="https://aosis.co.za/portfolio/problem-based-learning-and-pedagogies-of-play-active-approaches-towards-self-directed-learning/" target="_blank" rel="noopener noreferrer">
                <img src={PB_Learning} alt="Problem-based Learning" />
                </a>
                <p>Problem-based learning and pedagogies of play: Active approaches towards Self-Directed Learning</p>
            </div>
            <div className="book-item">
                <a href="https://aosis.co.za/portfolio/contextualised-open-educational-practices-towards-student-agency-and-self-directed-learning/" target="_blank" rel="noopener noreferrer">
                <img src={ContextualisedPractices} alt="Contextualised Practices" />
                </a>
                <p>Contextualised open educational practices: Towards student agency and self-directed learning</p>
            </div>
            <div className="book-item">
                <a href="https://aosis.co.za/portfolio/self-directed-learning-in-the-era-of-the-covid-19-pandemic-research-on-the-affordances-of-online-virtual-excursions/" target="_blank" rel="noopener noreferrer">
                <img src={Covid19} alt="Self-Directed Learning during COVID-19" />
                </a>
                <p>Self-Directed Learning in the era of the COVID-19 pandemic: Research on the affordances of online virtual excursions</p>
            </div>
            <div className="book-item">
                <a href="https://aosis.co.za/portfolio/learning-through-assessment-an-approach-towards-self-directed-learning/" target="_blank" rel="noopener noreferrer">
                <img src={LearningAssessment} alt="Learning through Assessment" />
                </a>
                <p>Learning through assessment: An approach towards self-directed learning</p>
            </div>
            <div className="book-item">
                <a href="https://aosis.co.za/portfolio/blended-learning-environments-to-foster-self-directed-learning/" target="_blank" rel="noopener noreferrer">
                <img src={BlendedLearning} alt="Blended Learning" />
                </a>
                <p>Blended learning environments to foster Self-Directed Learning</p>
            </div>
            <div className="book-item">
                <a href="https://aosis.co.za/portfolio/becoming-a-teacher-research-on-the-work-integrated-learning-of-student-teachersdirected-learning-research-and-its-impact-on-educational-practice-3/" target="_blank" rel="noopener noreferrer">
                <img src={BecomingTeacher} alt="Becoming a Teacher" />
                </a>
                <p>Becoming a Teacher: Research on the work-integrated learning of student teachers</p>
            </div>
            <div className="book-item">
                <a href="https://aosis.co.za/portfolio/self-directed-multimodal-learning-in-higher-education/" target="_blank" rel="noopener noreferrer">
                <img src={SelfDirectedLearning} alt="Self-directed Learning" />
                </a>
                <p>Self-directed multimodal learning in higher education</p>
            </div>
            <div className="book-item">
                <a href="https://aosis.co.za/portfolio/self-directed-learning-an-imperative-for-education-in-a-complex-society/" target="_blank" rel="noopener noreferrer">
                <img src={SelfDirectedComplex} alt="Self-directed Learning in Complex Society" />
                </a>
                <p>Self-Directed Learning: An imperative for education in a complex society</p>
            </div>
            <div className="book-item">
                <a href="https://aosis.co.za/portfolio/self-directed-learning-for-the-21st-century-implications-for-higher-education/" target="_blank" rel="noopener noreferrer">
                <img src={SelfDirected21st} alt="Self-directed Learning for the 21st Century" />
                </a>
                <p>Self-Directed Learning for the 21st Century: Implications for Higher Education</p>
            </div>
            <div className="book-item">
                <a href="https://aosis.co.za/portfolio/self-directed-learning-research-and-its-impact-on-educational-practice-2/" target="_blank" rel="noopener noreferrer">
                <img src={SelfDirectedImpact} alt="Self-directed Learning Research and Impact" />
                </a>
                <p>Self-directed learning research and its impact on educational practice</p>
            </div>
            <div className="book-item">
                <a href="https://aosis.co.za/portfolio/the-decolonisation-of-the-curriculum-project-the-affordances-of-indigenous-knowledge-for-self-directed-learning/" target="_blank" rel="noopener noreferrer">
                <img src={DecolonisationCP} alt="Decolonisation of the Curriculum" />
                </a>
                <p>The decolonisation of the curriculum project: The affordances of indigenous knowledge for self-directed learning</p>
            </div>
            </div>
            <div className="footer-banner">
            <img src={SDLWebBanner} alt="SDL Web Banner" />
            </div>
        </div>
        );
    }
    
export default SelfDirectedLearningPage;