//importing correct react
import React, { useEffect, useState } from 'react';

//importing the database
import { db } from '../../config/firebase';

//importing create table
import { CreateTable } from '../../components/table/table';

//functionality to make use of the docs
import { getDocs, collection } from 'firebase/firestore';
import './LifeSciencePage.css';

const lifeScienceIntroduction = "Welcome to our Life Science Resources page, a treasure trove of educational materials crafted with care by students from the Faculty of Education at North-West University. Our collection is diverse, ranging from detailed explanations on specific topics to comprehensive semester-long planning guides. Designed with a focus on self-directed learning, these resources incorporate cooperative learning and project-based learning strategies to foster a more engaging and effective learning environment. While all materials have undergone peer evaluation to ensure quality, we value your feedback to further enhance their effectiveness. Please take a moment to complete the evaluation form (at the bottom of the page) for any resource you use. Your insights are crucial in identifying areas for improvement and recognizing outstanding contributions. These open educational resources (OER) are freely available, reflecting our commitment to accessible and collaborative education.";

function LifeSciencePage() {
    //the constrant that will store all the values
    const [resources, setResources] = useState([])

    //making use of use effect sothat it is more dynamic
    useEffect(() => {
        //a collection that will store the overall values of LifeScience_Main
        const resourceCollectionRef = collection(db, "PDFS", "LifeScience_Main", "LifeScience")

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
        <div className="life-science-page">
        <h1 className="subject-title">Life Science</h1>
        <h2 className="section-subtitle">Introduction to Life Science Resources</h2>
        <div className="subject-introduction">
            <p>{lifeScienceIntroduction}</p>
        </div>
        <h2 className="section-subtitle">Resources</h2>
        <div className="subject-gallery">
            <CreateTable resources={resources} collectionOne={"PDFS"} mainDoc={"LifeScience_Main"} CollectionTwo={"LifeScience"}/>
        </div>
        </div>
    );
}

export default LifeSciencePage;
