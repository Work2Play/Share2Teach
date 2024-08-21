import React from 'react';
import './OtherOERsPage.css';
import InnovateEducate from '../../Images/InnovateEducate.png';
import CSEBoek from '../../Images/CSE_boek.png';


function OtherOERsPage() {
    return (
        <div className="oers-page">
            
            <h1>Other useful OER's</h1>
            <div className="oer-section">
                <h2>Merlot</h2>
                <a href="https://www.merlot.org/merlot/materials.htm?sort.property=overallRating" target="_blank" rel="noopener noreferrer">
                https://www.merlot.org/merlot/materials.htm?sort.property=overallRating
                </a>
            </div>
            <div className="oer-section">
                <h2>Innovate Educate Book Series</h2>
                <img src={InnovateEducate} alt="Innovate Educate" className="oer-image" />
                <h3>Computer Science: Knowledge for Educators</h3>
                <p>
                In the digital tapestry of the 21st century, education, particularly in the realms of Computer Applications Technology (CAT) and Information Technology (IT), stands at the forefront of innovation and transformation. It is with immense pride and enthusiasm that we present this pioneering Open Educational Resource (OER) Textbook: a testament to the collaborative spirit and intellectual rigor of a group of distinguished postgraduate students from North-West University, South Africa: L. Van der Walt, B. Mokholewana and N. Mbele. Under the editorship of Dr. C. Bosch, this textbook emerges as a beacon of knowledge, co-creation, and dissemination, meticulously crafted to serve the vibrant community of computer science educators.
                </p>
                <p>
                Embarking on a journey through the rich landscapes of learning theories in CAT and IT education, this textbook unveils the multifaceted dimensions of teaching and learning strategies that resonate with the demands of contemporary education. It meticulously navigates through the intricacies of effective pedagogical approaches, ensuring that educators are well-equipped to foster environments where learning is not just absorbed but experienced and enacted.
                </p>
                <p>Download Open Textbook here:</p>
                <a href="/bookpdf/Computer Science_Knowledge for Educators.pdf" target="_blank" rel="noopener noreferrer">
                    <img src={CSEBoek} alt="Computer Science Book" className="oer-image" />
                </a>
            </div>
            </div>
        );
    }

export default OtherOERsPage;
