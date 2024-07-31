import React from 'react';
import './ComputerSciencePage.css';

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
        <h2 className="section-subtitle">Download Open Textbook here:</h2>
        <div className="subject-gallery">
            <div className="placeholder">
            {/* Placeholder for future image */}
            <p>Image placeholder 1</p>
            </div>
            <div className="placeholder">
            <a href="path/to/computer_science_book.pdf" target="_blank" rel="noopener noreferrer">
                <p>Image placeholder 2 (Link to PDF)</p>
            </a>
            </div>
        </div>
        </div>
    );
    }

export default ComputerSciencePage;
