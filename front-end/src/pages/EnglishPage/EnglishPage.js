//importing correct react
import React, { useEffect, useState } from 'react';

//importing the database
import { db } from '../../config/firebase';

//importing create table
import { CreateTable } from '../../components/table/table';

//functionality to make use of the docs
import { collection, onSnapshot } from 'firebase/firestore';
import './EnglishPage.css';



const englishIntroduction = "Welcome to our English Resources page, a treasure trove of educational materials crafted with care by students from the Faculty of Education at North-West University. Our collection is diverse, ranging from detailed explanations on specific topics to comprehensive semester-long planning guides. Designed with a focus on self-directed learning, these resources incorporate cooperative learning and project-based learning strategies to foster a more engaging and effective learning environment. While all materials have undergone peer evaluation to ensure quality, we value your feedback to further enhance their effectiveness. Please take a moment to complete the evaluation form (at the bottom of the page) for any resource you use. Your insights are crucial in identifying areas for improvement and recognizing outstanding contributions. These open educational resources (OER) are freely available, reflecting our commitment to accessible and collaborative education.";

function EnglishPage() {
    //the constrant that will store all the values
    const [resources, setResources] = useState([])

    // Using useEffect to set up real-time listener for Firestore updates
    useEffect(() => {

        // Reference to the Firestore collection
        const resourceCollectionRef = collection(db, "PDFS", "English_Main", "English");

        // Set up the Firestore onSnapshot listener
        const unsubscribe = onSnapshot(resourceCollectionRef, (snapshot) => {
            // Get the updated resources and only include verified ones
            const updatedResources = snapshot.docs
                .map(doc => ({ ...doc.data(), id: doc.id }))
                .filter(doc => doc.verified);

            setResources(updatedResources); // Update the state with new data
        }, (error) => {
            console.error("Error fetching real-time data: ", error);
        });
        
        // Cleanup function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    return (
        <div className="english-page">
        <h1 className="subject-title">English</h1>
        <h2 className="section-subtitle">Introduction to English Resources</h2>
        <div className="subject-introduction">
            <p>{englishIntroduction}</p>
        </div>
        <h2 className="section-subtitle">Resources</h2>
        <div className="subject-gallery">
            <CreateTable resources={resources} collectionOne={"PDFS"} mainDoc={"English_Main"} CollectionTwo={"English"}/>
        </div>
        </div>
    );
}

export default EnglishPage;
