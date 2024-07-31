import React from 'react';
import './TechnologyPage.css';

const technologyResources = [
    { title: "Brue, kragte & strukture - chantel brits.pptx", lastModified: "4/15/22 chantel brits" },
  // Add more resources here
];

const technologyIntroduction = "Welcome to our Technology Resources page, a treasure trove of educational materials crafted with care by students from the Faculty of Education at North-West University. Our collection is diverse, ranging from detailed explanations on specific topics to comprehensive semester-long planning guides. Designed with a focus on self-directed learning, these resources incorporate cooperative learning and project-based learning strategies to foster a more engaging and effective learning environment. While all materials have undergone peer evaluation to ensure quality, we value your feedback to further enhance their effectiveness. Please take a moment to complete the evaluation form (at the bottom of the page) for any resource you use. Your insights are crucial in identifying areas for improvement and recognizing outstanding contributions. These open educational resources (OER) are freely available, reflecting our commitment to accessible and collaborative education.";

function TechnologyPage() {
    return (
        <div className="technology-page">
        <h1 className="subject-title">Technology</h1>
        <h2 className="section-subtitle">Introduction to Technology Resources</h2>
        <div className="subject-introduction">
            <p>{technologyIntroduction}</p>
        </div>
        <h2 className="section-subtitle">Resources</h2>
        <div className="subject-gallery">
            <table className="resource-table">
            <thead>
                <tr>
                <th>Title</th>
                <th>Last Modified</th>
                </tr>
            </thead>
            <tbody>
                {technologyResources.map((resource, index) => (
                <tr key={index}>
                    <td>{resource.title}</td>
                    <td>{resource.lastModified}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
}

export default TechnologyPage;
