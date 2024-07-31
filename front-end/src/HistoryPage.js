import React from 'react';
import './HistoryPage.css';

const historyResources = [
  { title: "Gr 7_Social Science_Slavery in the American South_AL.docx", lastModified: "12/12/23 Stehe Helm" },
  { title: "Gr 7_Social Science_The impact of the transatlantic slave trade_AL.docx", lastModified: "12/12/23 Stehe Helm" },
  { title: "Gr 7_Social Science_The nature of slavery in West Africa before the European slave trade_AL.docx", lastModified: "12/12/23 Stehe Helm" },
  // Add more resources here
];

const historyIntroduction = "Welcome to our History Resources page, a treasure trove of educational materials crafted with care by students from the Faculty of Education at North-West University. Our collection is diverse, ranging from detailed explanations on specific topics to comprehensive semester-long planning guides. Designed with a focus on self-directed learning, these resources incorporate cooperative learning and project-based learning strategies to foster a more engaging and effective learning environment. While all materials have undergone peer evaluation to ensure quality, we value your feedback to further enhance their effectiveness. Please take a moment to complete the evaluation form (at the bottom of the page) for any resource you use. Your insights are crucial in identifying areas for improvement and recognizing outstanding contributions. These open educational resources (OER) are freely available, reflecting our commitment to accessible and collaborative education.";

function HistoryPage() {
    return (
        <div className="history-page">
        <h1 className="subject-title">History</h1>
        <h2 className="section-subtitle">Introduction to History Resources</h2>
        <div className="subject-introduction">
            <p>{historyIntroduction}</p>
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
                {historyResources.map((resource, index) => (
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

export default HistoryPage;
