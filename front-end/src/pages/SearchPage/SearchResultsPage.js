import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchResultsPage.css';

import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const SearchResultsPage = () => {
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryTerm = searchParams.get('q');
    setSearchTerm(queryTerm || '');

    if (queryTerm) {
      fetchResults(queryTerm);
    }
  }, [location]);

  const fetchResults = async (term) => {
    try {
      const subjects = [
        'Afrikaans', 'Business', 'English', 'Geography',
        'History', 'LifeScience', 'LifeSkills', 'Maths',
        'NaturalScience', 'Technology'
      ];
      let allResults = [];

      for (const subject of subjects) {
        const collectionRef = collection(db, `PDFS/${subject}_Main/${subject}`);
        const q = query(collectionRef, where('verified', '==', true));
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allResults = allResults.concat(docs);
      }

      const termLower = term.toLowerCase();

      const filteredResults = allResults.filter(doc => {
        const titleMatch = doc.title && doc.title.toLowerCase().includes(termLower);
        const tagsMatch = doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(termLower));
        const subjectMatch = doc.subject && doc.subject.toLowerCase().includes(termLower);
        return titleMatch || tagsMatch || subjectMatch;
      });

      setResults(filteredResults);
    } catch (err) {
      console.error("Error fetching search results:", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === '') return;

    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.set('q', searchTerm);
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="search-results-page">
      <div className="search-header">
        <h1>Search Results</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by keywords..."
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>
      <div className="results-container">
        {results.length > 0 ? (
          <table className="results-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Tags</th>
                <th>Subject</th>
                <th>Grade</th>
                <th>Last Modified Date</th>
                <th>Uploaded By</th>
                <th>Rating</th>
                <th>Number of Ratings</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id}>
                  <td>
                    <a href={result.file_url} target="_blank" rel="noopener noreferrer">
                      {result.title}
                    </a>
                  </td>
                  <td>{result.tags ? result.tags.join(', ') : 'No Tags'}</td>
                  <td>{result.subject}</td>
                  <td>{result.grade}</td>
                  <td>{result.modifiedAt ? result.modifiedAt.toDate().toLocaleString() : 'N/A'}</td>
                  <td>{result.userID}</td>
                  <td>{result.rating || 0}</td>
                  <td>{result.ratingAmount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No results found for "{searchTerm}".</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
