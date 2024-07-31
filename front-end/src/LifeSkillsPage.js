import React from 'react';
import './LifeSkillsPage.css';

const lifeSkillsResources = [
    { title: "318 - Life skills - Gr. 3 term 3 - Pollution - Freda olivier.pdf", lastModified: "4/23/22 Freda olivier" },
    { title: "Gr 1_Life Skills_At school_AL.docx", lastModified: "12/20/23" },
    { title: "Gr 1_Life Skills_Balance_AL.docx", lastModified: "12/19/23" },
    { title: "Gr 1_Life Skills_Coordination_AL.docx", lastModified: "12/19/23" },
    { title: "Gr 1_Life Skills_Create in 2D_AL.docx", lastModified: "12/19/23" },
  // Add more resources here
];

const lifeSkillsIntroduction = "Welcome to our Life Skills Resources page, a treasure trove of educational materials crafted with care by students from the Faculty of Education at North-West University. Our collection is diverse, ranging from detailed explanations on specific topics to comprehensive semester-long planning guides. Designed with a focus on self-directed learning, these resources incorporate cooperative learning and project-based learning strategies to foster a more engaging and effective learning environment. While all materials have undergone peer evaluation to ensure quality, we value your feedback to further enhance their effectiveness. Please take a moment to complete the evaluation form (at the bottom of the page) for any resource you use. Your insights are crucial in identifying areas for improvement and recognizing outstanding contributions. These open educational resources (OER) are freely available, reflecting our commitment to accessible and collaborative education.";

function LifeSkillsPage() {
    return (
        <div className="life-skills-page">
        <h1 className="subject-title">Life Skills</h1>
        <h2 className="section-subtitle">Introduction to Life Skills Resources</h2>
        <div className="subject-introduction">
            <p>{lifeSkillsIntroduction}</p>
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
                {lifeSkillsResources.map((resource, index) => (
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

export default LifeSkillsPage;
