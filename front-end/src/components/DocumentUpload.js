// src/components/DocumentUpload.js
import React, { useState } from 'react';
import { db } from '../firebase';

const DocumentUpload = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await db.collection('documents').add({
            title,
            content,
        });
        setTitle('');
        setContent('');
        alert('Document uploaded successfully');
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
