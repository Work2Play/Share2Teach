// src/components/DocumentUpload.js
import React, { useState } from 'react';
import axios from '../api/axios';

const DocumentUpload = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const document = { title, content };

        try {
            await axios.post('/documents', document);
            alert('Document uploaded successfully');
        } catch (error) {
            console.error('Error uploading document:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button type="submit">Upload Document</button>
        </form>
    );
};

export default DocumentUpload;
