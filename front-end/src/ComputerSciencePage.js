import React from 'react';
import './ComputerSciencePage.css';
import InnovateEducate from './Images/InnovateEducate.png';
import CSEBoek from './Images/CSE_boek.png';
const computerScienceIntroduction = "Computer Science: Knowledge for Educators";

const computerScienceText = `In the digital tapestry of the 21st century, education, particularly in the realms of Computer Applications Technology (CAT) and Information Technology (IT), stands at the forefront of innovation and transformation. It is with immense pride and enthusiasm that we present this pioneering Open Educational Resource (OER) textbook: a testament to the collaborative spirit and intellectual rigor of a group of distinguished postgraduate students from North-West University, South Africa: L. Van der Walt, B. Mokholwane, and N. Mbebe. Under the editorship of Dr. C. Bosch, this textbook emerges as a beacon of knowledge, co-creation, and dissemination, meticulously crafted to serve the vibrant community of computer science educators.

Embarking on a journey through the rich landscapes of learning theories in CAT and IT education, this textbook unveils the multifaceted dimensions of teaching and learning strategies that resonate with the demands of contemporary education. It meticulously navigates through the intricacies of effective pedagogical approaches, ensuring that educators are well-equipped to foster environments where learning is not just absorbed but experienced and enacted.`;

function ComputerSciencePage() {
    return (
        <div className="computer-science-page">
        <h1 className="subject-title">Computer Science</h1>
        <h2 className="section-subtitle">Innovate Educate Book Series</h2>
        <div className="subject-introduction">
            <p>{computerScienceIntroduction}</p>
            <p>{computerScienceText}</p>
        </div>
        <img src={InnovateEducate} alt="Innovate Educate" className="oer-image" />
        <h2 className="section-subtitle">Download Open Textbook here:</h2>
        
        <a href="/bookpdf/Computer Science_Knowledge for Educators.pdf" target="_blank" rel="noopener noreferrer">
            <img src={CSEBoek} alt="Computer Science Book" className="oer-image" />
        </a>

        </div>
        
    );
    }

export default ComputerSciencePage;
