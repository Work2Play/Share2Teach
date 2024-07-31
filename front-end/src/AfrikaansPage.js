//importing correct react
import React, { useEffect, useState } from 'react';

//importing the database
import { db } from './config/firebase';

//functionality to make use of the docs
import { getDocs, collection } from 'firebase/firestore';
import './AfrikaansPage.css';

const afrikaansIntroduction = "Welcome to our Afrikaans Resources page, a treasure trove of educational materials crafted with care by students from the Faculty of Education at North-West University. Our collection is diverse, ranging from detailed explanations on specific topics to comprehensive semester-long planning guides. Designed with a focus on self-directed learning, these resources incorporate cooperative learning and project-based learning strategies to foster a more engaging and effective learning environment. While all materials have undergone peer evaluation to ensure quality, we value your feedback to further enhance their effectiveness. Please take a moment to complete the evaluation form (at the bottom of the page) for any resource you use. Your insights are crucial in identifying areas for improvement and recognizing outstanding contributions. These open educational resources (OER) are freely available, reflecting our commitment to accessible and collaborative education.";

function AfrikaansPage() {
    //the constrant that will store all the values for maths
    const [resources, setResources] = useState([])

    //a collection that will store the overall values of Math_Main
    const resourceCollectionRef = collection(db, "PDFS", "Afrikaans_Main", "afrikaans")

    //making use of use effect sothat it is more dynamic
    useEffect(() => {
        const getResources = async () => {
            //reading the resources
            try {
                const data = await getDocs(resourceCollectionRef)
                //geting the filtered data and only getting data that is verified
                const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id,})).filter((doc) => doc.verified)
                setResources(filteredData)
            } catch (err) {
                console.error(err)
            }
        }
        //getting the resources
        getResources();
    }, [])
    
    return (
        <div className="afrikaans-page">
        <h1 className="subject-title">Afrikaans</h1>
        <h2 className="section-subtitle">Introduction to Afrikaans Resources</h2>
        <div className="subject-introduction">
            <p>{afrikaansIntroduction}</p>
        </div>
        <h2 className="section-subtitle">Resources</h2>
        <div className="subject-gallery">
            <table className="resource-table">
            <thead>
                <tr>
                <th>Title</th>
                <th>Last Modified Date</th>
                <th>Last Modified User</th>
                <th>Rating</th>
                <th>Amount Of Ratings Recieved</th>
                </tr>
            </thead>
            <tbody>
                {resources.map((resource) => (
                <tr key={resource.id}>
                    <td>{resource.title}</td>
                    <td>{resource.dateMod}</td>
                    <td>{resource.userMod}</td>
                    <td>{resource.rating}</td>
                    <td>{resource.ratingAmount}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
}

export default AfrikaansPage;
