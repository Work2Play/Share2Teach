import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
//import { logPageView } from '../components/Fetch_Analytics';
import './DisplayAnalytics.css';


const Display_Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState([]);
    //const [uploadCount, setUploadCount] = useState(0);
    //const [pageViews, setPageViews] = useState(0); //Holds the number of time the users viewed the page

    //Get the analytics data from collection in firestore 
    useEffect(() => {
        const RefAnalytics = collection(db, "analytics_data");
        const quer = query(RefAnalytics, orderBy("timestamp", "desc"), limit(10)); //to get the 10 most recent events

        const unsubscribe = onSnapshot(quer, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));

            console.log('Fetched analytics data:', data); //in order to log the fetched data
            console.log('Timestamp type:', data.map(item => item.timestamp)); //For logging the timestamp type

            setAnalyticsData(data);
            //setUploadCount(data.lenght);
        });

        return () => unsubscribe();
    }, []);

    /*useEffect(() => {
        logPageView(); // Log the page view
        setPageViews((prev) => prev + 1); //Increments the page view count
    })  
    */
    
    

    return (
        <div className="analytics-container">
            <h3 className="analytics-header">Most Recent User Activity</h3>
            <ul>
                {analyticsData.map((item) => (
                    <li key={item.id}>
                        User {item.userID} uploaded "{item.title}" in {item.subject} on {item.timestamp.toDate().toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Display_Analytics;