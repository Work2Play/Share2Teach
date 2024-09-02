import React, { useEffect, useState } from 'react';
import './ModerationPage.css';
import { db } from '../../config/firebase'; // Update this path if necessary
import { getDocs, collectionGroup, updateDoc, deleteDoc } from 'firebase/firestore';

const ModerationPage = () => {
    const [unverifiedPDFs, setUnverifiedPDFs] = useState([]);
    const [reportedPDFs, setReportedPDFs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch documents from subcollections like 'Afrikaans'
                const pdfQuerySnapshot = await getDocs(collectionGroup(db, "Afrikaans"));

                const allPDFs = pdfQuerySnapshot.docs.map((doc) => ({
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
                                <td>{pdf.userID}</td>
                                <td>{pdf.modifiedAt ? pdf.modifiedAt.toDate().toLocaleString() : 'N/A'}</td>
                                <td>
                                    <button className="approve-button" onClick={() => approvePDF(pdf)}>Approve</button>
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
