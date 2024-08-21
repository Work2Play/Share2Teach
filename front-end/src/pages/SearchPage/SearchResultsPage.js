import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SearchResultsPage.css'; // Assuming you have a separate CSS file for styling

// Importing Firebase database
import { db } from '../../config/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';

const SearchResultsPage = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryTerm = searchParams.get('q');
    setSearchTerm(queryTerm);

    const fetchResults = async () => {
      try {
        const q = query(
          collection(db, "PDFS"), // Target the broader "PDFS" collection
          where('keywords', 'array-contains', queryTerm)
        );
        const data = await getDocs(q);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setResults(filteredData);
      } catch (err) {
        console.error("Error fetching search results:", err);
      }
    };

    if (queryTerm) {
      fetchResults();
    }
  }, [location]);

  return (
    <div className="search-results-page">
      <div className="search-header">
        <h1>Search Results</h1>
        {searchTerm && <h2 className="search-term">Results for: "{searchTerm}"</h2>}
      </div>
      <div className="results-container">
        {results.length > 0 ? (
          <table className="results-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Last Modified Date</th>
                <th>Last Modified User</th>
                <th>Rating</th>
                <th>Amount Of Ratings Received</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id}>
                  <td>{result.title}</td>
                  <td>{result.dateMod}</td>
                  <td>{result.userMod}</td>
                  <td>{result.rating}</td>
                  <td>{result.ratingAmount}</td>
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
