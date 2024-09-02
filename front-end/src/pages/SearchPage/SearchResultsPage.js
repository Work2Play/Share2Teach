import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SearchResultsPage.css'; // Assuming you have a separate CSS file for styling

// Importing Firebase database
import { db } from '../../config/firebase';
import { getDocs, collectionGroup, query, where } from 'firebase/firestore';

const SearchResultsPage = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryTerm = searchParams.get('query'); // Changed to match SearchComponent.js
    setSearchTerm(queryTerm); // Save the search term for display

    const fetchResults = async () => {
      if (queryTerm) {
        try {
          const collectionsToQuery = [
            collectionGroup(db, "Afrikaans"),
            collectionGroup(db, "Business"),
            collectionGroup(db, "English"),
            collectionGroup(db, "Geography"),
            collectionGroup(db, "History"),
            collectionGroup(db, "LifeScience"),
            collectionGroup(db, "LifeSkills"),
            collectionGroup(db, "Math"),
            collectionGroup(db, "NaturalScience"),
            collectionGroup(db, "Technology")
          ];

          const queryPromises = collectionsToQuery.map(collectionRef =>
            getDocs(query(
              collectionRef,
              where('title', '>=', queryTerm),
              where('title', '<=', queryTerm + '\uf8ff')
            ))
          );

          const querySnapshots = await Promise.all(queryPromises);
          const allDocs = querySnapshots.flatMap(snapshot => snapshot.docs);

          const filteredData = allDocs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));

          setResults(filteredData);
        } catch (err) {
          console.error("Error fetching search results:", err);
        }
      }
    };

    fetchResults();
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
                  <td>
                    <a href={result.file_url} target="_blank" rel="noopener noreferrer">
                      {result.title}
                    </a>
                  </td>
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
