import React, { useEffect, useState } from 'react';
import './ModerationPage.css';
import { db, storage } from '../../config/firebase'; // Update this path if necessary
import { getDocs, collectionGroup, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

const ModerationPage = () => {
    const [unverifiedPDFs, setUnverifiedPDFs] = useState([]);
    const [reportedPDFs, setReportedPDFs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch documents from subcollections like 'Afrikaans'
                const collectionsToQuery = [collectionGroup(db, "Afrikaans"), 
                    collectionGroup(db, "Business"), 
                    collectionGroup(db, "English"), 
                    collectionGroup(db, "Geography"), 
                    collectionGroup(db, "History"),
                    collectionGroup(db, "LifeScience"),
                    collectionGroup(db, "LifeSkills"),
                    collectionGroup(db, "Math"),
                    collectionGroup(db, "NaturalScience"),
                    collectionGroup(db, "Technology")
                ]

                const queryPromises = collectionsToQuery.map(collectionRef => getDocs(collectionRef));

                const pdfQuerySnapshot = await Promise.all(queryPromises);

                const allDocs = pdfQuerySnapshot.flatMap(snapshot => snapshot.docs);

                const allPDFs = allDocs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                    ref: doc.ref,
                }));

                // Filter PDFs without 'verified' field for unverified section
                const unverified = allPDFs.filter((pdf) => pdf.verified === undefined);
                const reported = allPDFs.filter((pdf) => pdf.reportAmount > 0); // Filter for reported PDFs

                setUnverifiedPDFs(unverified);
                setReportedPDFs(reported);
            } catch (err) {
                console.error("Error fetching PDFs:", err);
            }
        };

        fetchData();
    }, []);

    // Approve unverified PDF and add necessary fields
    const approvePDF = async (pdf) => {
        try {
            await updateDoc(pdf.ref, {
                verified: true,
                rating: pdf.rating || 0,
                ratingAmount: pdf.ratingAmount || 0,
                reportAmount: pdf.reportAmount || 0,
            });
            setUnverifiedPDFs(unverifiedPDFs.filter((item) => item.id !== pdf.id));
        } catch (err) {
            console.error("Error approving PDF:", err);
        }
    };

    const deletePDF = async (pdf) => {
        try {
            await deleteDoc(pdf.ref);

            //to delete the file in firebase storage aswell
            try {
                const storageRef = ref(storage, pdf.file_url); // Create a reference from the URL
                await deleteObject(storageRef);
                console.log('File deleted successfully');
                } catch (error) {
                console.error('Error deleting file:', error);   
                }
            setUnverifiedPDFs(unverifiedPDFs.filter((item) => item.id !== pdf.id));
        } catch (err) {
            console.error("Error approving PDF:", err);
        }
    };

    // Approve reported PDF and reset reportAmount to 0
    const approveReportedPDF = async (pdf) => {
        try {
            await updateDoc(pdf.ref, {
                reported: false,
                reportAmount: 0, // Reset report amount to 0
            });
            setReportedPDFs(reportedPDFs.filter((item) => item.id !== pdf.id));
        } catch (err) {
            console.error("Error approving reported PDF:", err);
        }
    };

    // Delete reported PDF
    const deleteReportedPDF = async (pdf) => {
        try {
            await deleteDoc(pdf.ref);

            //to delete the file in firebase storage aswell
            try {
                const storageRef = ref(storage, pdf.file_url); // Create a reference from the URL
                await deleteObject(storageRef);
                console.log('File deleted successfully');
                } catch (error) {
                console.error('Error deleting file:', error);   
                }
                
            setReportedPDFs(reportedPDFs.filter((item) => item.id !== pdf.id));
        } catch (err) {
            console.error("Error deleting reported PDF:", err);
        }
    };

    return (
        <div className="moderation-page">
            <h1>Moderation Page</h1>

            <h2>Unverified PDFs</h2>
            {unverifiedPDFs.length > 0 ? (
                <table className="moderation-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Subject</th>
                            <th>Uploaded By</th>
                            <th>Upload Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unverifiedPDFs.map((pdf) => (
                            <tr key={pdf.id}>
                                <td>
                                    <a href={pdf.file_url} target="_blank" rel="noopener noreferrer">
                                        {pdf.title}
                                    </a>
                                </td>
                                <td>{pdf.subject}</td>
                                <td>{pdf.userID}</td>
                                <td>{pdf.modifiedAt ? pdf.modifiedAt.toDate().toLocaleString() : 'N/A'}</td>
                                <td>
                                    <button className="approve-button" onClick={() => approvePDF(pdf)}>Approve</button>
                                    <button className="reject-button" onClick={() => deletePDF(pdf)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No unverified PDFs found.</p>
            )}

            <h2>Reported PDFs</h2>
            {reportedPDFs.length > 0 ? (
                <table className="moderation-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Subject</th>
                            <th>Amount Reported</th>
                            <th>Uploaded By</th>
                            <th>Upload Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportedPDFs.map((pdf) => (
                            <tr key={pdf.id}>
                                <td>
                                    <a href={pdf.file_url} target="_blank" rel="noopener noreferrer">
                                        {pdf.title}
                                    </a>
                                </td>
                                <td>{pdf.subject}</td>
                                <td>{pdf.reportAmount}</td>
                                <td>{pdf.userID}</td>
                                <td>{pdf.modifiedAt ? pdf.modifiedAt.toDate().toLocaleString() : 'N/A'}</td>
                                <td>
                                    <button className="approve-button" onClick={() => approveReportedPDF(pdf)}>Approve</button>
                                    <button className="reject-button" onClick={() => deleteReportedPDF(pdf)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No reported PDFs found.</p>
            )}
        </div>
    );
};

export default ModerationPage;
