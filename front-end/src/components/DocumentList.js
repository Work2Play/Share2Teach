// src/components/DocumentList.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const docs = [];
            const snapshot = await db.collection('documents').get();
            snapshot.forEach(doc => {
                docs.push({ id: doc.id, ...doc.data() });
            });
            setDocuments(docs);
        };
        fetchData();
    }, []);

    return (
        <ul>
            {documents.map(doc => (
                <li key={doc.id}>{doc.title}</li>
            ))}
        </ul>
    );
};

export default DocumentList;
