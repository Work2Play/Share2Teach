// src/App.js
import React from 'react';
import './App.css';
import DocumentList from './components/DocumentList';
import DocumentUpload from './components/DocumentUpload';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Welcome to Share2Teach</h1>
                <DocumentUpload />
                <DocumentList />
            </header>
        </div>
    );
}

export default App;
