// src/components/DocumentList.js
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        axios.get('/documents')
            .then(response => setDocuments(response.data))
            .catch(error => console.error('Error fetching documents:', error));
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
