import React, { useEffect, useState, } from 'react';
import './ModerationPage.css';
import { db, storage } from '../../config/firebase';
import { collectionGroup, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { CSVLink } from 'react-csv'; // To handle CSV export

const ModerationPage = () => {
    const [unverifiedPDFs, setUnverifiedPDFs] = useState([]);
    const [reportedPDFs, setReportedPDFs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
    const [allPDFs, setAllPDFs] = useState({}); // To store all PDFs

    useEffect(() => {
        const unsubscribes = [];

        // List of collection groups to listen to
        const collectionsToQuery = [
            collectionGroup(db, "Afrikaans"), collectionGroup(db, "Business"),
            collectionGroup(db, "English"), collectionGroup(db, "Geography"),
            collectionGroup(db, "History"), collectionGroup(db, "LifeScience"),
            collectionGroup(db, "LifeSkills"), collectionGroup(db, "Maths"),
            collectionGroup(db, "NaturalScience"), collectionGroup(db, "Technology")
        ];

        // Set up real-time listeners
        collectionsToQuery.forEach((collectionRef) => {
            const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
                setAllPDFs(prevAllPDFs => {
                    const updatedAllPDFs = { ...prevAllPDFs };
                    snapshot.docChanges().forEach((change) => {
                        const pdfData = {
                            ...change.doc.data(),
                            id: change.doc.id,
                            ref: change.doc.ref,
                        };
                        if (change.type === "added" || change.type === "modified") {
                            updatedAllPDFs[change.doc.id] = pdfData;
                        } else if (change.type === "removed") {
                            delete updatedAllPDFs[change.doc.id];
                        }
                    });
                    return updatedAllPDFs;
                });
            });

            unsubscribes.push(unsubscribe);
        });

        // Clean up listeners on unmount
        return () => {
            unsubscribes.forEach(unsubscribe => unsubscribe());
        };
    }, []);

    // Update unverifiedPDFs and reportedPDFs whenever allPDFs changes
    useEffect(() => {
        const allPDFsArray = Object.values(allPDFs);
        setUnverifiedPDFs(allPDFsArray.filter((pdf) => pdf.verified === undefined));
        setReportedPDFs(allPDFsArray.filter((pdf) => pdf.reportAmount > 0));
    }, [allPDFs]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const sortData = (data, key) => {
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            return [...data].sort((a, b) => (a[key] > b[key] ? -1 : 1));
        }
        return [...data].sort((a, b) => (a[key] > b[key] ? 1 : -1));
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedData = (data) => {
        return sortData(
            data.filter((pdf) => {
                const searchLower = searchTerm.toLowerCase();
                const tagsMatch = pdf.tags && pdf.tags.some(tag => tag.toLowerCase().includes(searchLower));
                const titleMatch = pdf.title.toLowerCase().includes(searchLower);
                const subjectMatch = pdf.subject.toLowerCase().includes(searchLower);
                return titleMatch || subjectMatch || tagsMatch;
            }),
            sortConfig.key
        );
    };

    // CSV Export
    const csvHeaders = [
        { label: "Title", key: "title" },
        { label: "Tags", key: "tags" },
        { label: "Subject", key: "subject" },
        { label: "Uploaded By", key: "userID" },
        { label: "Upload Date", key: "modifiedAt" },
        { label: "Verified", key: "verified" },
        { label: "Reported", key: "reportAmount" }
    ];

    const csvData = filteredAndSortedData([...unverifiedPDFs, ...reportedPDFs]).map(pdf => ({
        title: pdf.title,
        tags: pdf.tags ? pdf.tags.join(', ') : '',
        subject: pdf.subject,
        userID: pdf.userID,
        //modifiedAt: pdf.modifiedAt ? pdf.modifiedAt.toDate().toLocaleString() : 'N/A',
        verified: pdf.verified ? 'Yes' : 'No',
        reportAmount: pdf.reportAmount
    }));

    // Approve unverified PDF and add necessary fields
    const approvePDF = async (pdf) => {
        try {
            await updateDoc(pdf.ref, {
                verified: true,
                rating: pdf.rating || 0,
                ratingAmount: pdf.ratingAmount || 0,
                reportAmount: pdf.reportAmount || 0,
            });
            // No need to update state manually; listeners will handle it
        } catch (err) {
            console.error("Error approving PDF:", err);
        }
    };

    const deletePDF = async (pdf) => {
        try {
            await deleteDoc(pdf.ref);

            // Delete the file in Firebase Storage
            try {
                const storageRef = ref(storage, pdf.file_url);
                await deleteObject(storageRef);
                console.log('File deleted successfully');
            } catch (error) {
                console.error('Error deleting file:', error);   
            }
            // No need to update state manually; listeners will handle it
        } catch (err) {
            console.error("Error deleting PDF:", err);
        }
    };

    // Approve reported PDF and reset reportAmount to 0
    const approveReportedPDF = async (pdf) => {
        try {
            await updateDoc(pdf.ref, {
                reported: false,
                reportAmount: 0, // Reset report amount to 0
            });
            // No need to update state manually; listeners will handle it
        } catch (err) {
            console.error("Error approving reported PDF:", err);
        }
    };

    // Delete reported PDF
    const deleteReportedPDF = async (pdf) => {
        try {
            await deleteDoc(pdf.ref);

            // Delete the file in Firebase Storage
            try {
                const storageRef = ref(storage, pdf.file_url);
                await deleteObject(storageRef);
                console.log('File deleted successfully');
            } catch (error) {
                console.error('Error deleting file:', error);   
            }
            // No need to update state manually; listeners will handle it
        } catch (err) {
            console.error("Error deleting reported PDF:", err);
        }
    };

    return (
        <div className="moderation-page">
            <h1>Moderation Page</h1>
            <input
                type="text"
                placeholder="Search Title, Subject, or Tags"
                value={searchTerm}
                onChange={handleSearch}
                className="overall-search"
            />
            <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename="pdf_moderation_data.csv"
                className="csv-export"
                target="_blank"
            >
                Export to CSV
            </CSVLink>
            
            {/* Unverified PDFs */}
            <h2>Unverified PDFs</h2>
            {unverifiedPDFs.length > 0 ? (
                <table className="moderation-table">
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('title')}>Title</th>
                            <th>Tags</th>
                            <th onClick={() => requestSort('subject')}>Subject</th>
                            <th onClick={() => requestSort('userID')}>Uploaded By</th>

                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedData(unverifiedPDFs).map((pdf) => (
                            <tr key={pdf.id}>
                                <td><a href={pdf.file_url} target="_blank" rel="noopener noreferrer">{pdf.title}</a></td>
                                <td>{pdf.tags ? pdf.tags.join(', ') : 'No Tags'}</td>
                                <td>{pdf.subject}</td>
                                <td>{pdf.userID}</td>

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

            {/* Reported PDFs */}
            <h2>Reported PDFs</h2>
            {reportedPDFs.length > 0 ? (
                <table className="moderation-table">
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('title')}>Title</th>
                            <th>Tags</th>
                            <th onClick={() => requestSort('subject')}>Subject</th>
                            <th onClick={() => requestSort('reportAmount')}>Amount Reported</th>
                            <th onClick={() => requestSort('userID')}>Uploaded By</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedData(reportedPDFs).map((pdf) => (
                            <tr key={pdf.id}>
                                <td><a href={pdf.file_url} target="_blank" rel="noopener noreferrer">{pdf.title}</a></td>
                                <td>{pdf.tags ? pdf.tags.join(', ') : 'No Tags'}</td>
                                <td>{pdf.subject}</td>
                                <td>{pdf.reportAmount}</td>
                                <td>{pdf.userID}</td>

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
