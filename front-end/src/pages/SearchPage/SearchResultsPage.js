import React from 'react';
import { useLocation } from 'react-router-dom';
import './SearchResultsPage.css';

function SearchResultsPage() {
  const location = useLocation();
  const { results, searchQuery, selectedSubject } = location.state || {};

  if (!results) {
    return <div>No results found.</div>;
  }

  return (
    <div className="results-container">
      <h1>Search Results</h1>
      <p>Search Query: {searchQuery}</p>
      {selectedSubject && <p>Subject: {selectedSubject}</p>}
      <div className="results-list">
        {results.map((doc) => (
          <div key={doc.id} className="result-item">
            <h3>{doc.title}</h3>
            <p>Subject: {doc.subject}</p>
            <p>Tags: {doc.tags.join(', ')}</p>
            <a href={doc.file_url} target="_blank" rel="noopener noreferrer">View Document</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResultsPage;