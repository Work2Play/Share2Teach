import React from 'react';
import 'C:\\Users\\ukmak\\Documents\\Share2Teach\\share2tech\\src\\styles\\pages.css';

interface LifeScienceResource {
  title: string;
  lastModified: string;
}

const lifeScienceResources: LifeScienceResource[] = [
  
  // Add more resources here
];

const lifeScienceIntroduction: string = "Welcome to our Mathematics Resources page, a treasure trove of educational materials crafted with care by students from the Faculty of Education at North-West University. Our collection is diverse, ranging from detailed explanations on specific topics to comprehensive semester-long planning guides. Designed with a focus on self-directed learning, these resources incorporate cooperative learning and project-based learning strategies to foster a more engaging and effective learning environment. While all materials have undergone peer evaluation to ensure quality, we value your feedback to further enhance their effectiveness. Please take a moment to complete the evaluation form (at the bottom of the page) for any resource you use. Your insights are crucial in identifying areas for improvement and recognising outstanding contributions. These open educational resources (OER) are freely available, reflecting our commitment to accessible and collaborative education.";

const lifeSciencePage: React.FC = () => {
    return (
        <div className="math-page"> 
            <h1 className="subject-title">Life Scienece</h1>
            <h2 className="section-subtitle">Introduction to Life Science Resources</h2>
            <div className="subject-introduction">
                <p>{lifeScienceIntroduction}</p>
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
                        {lifeScienceResources.map((resource, index) => (
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

export default lifeSciencePage;