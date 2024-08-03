import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SearchResultsPage = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    
    // Here you would typically fetch search results based on the query
    // For now, we'll just set some dummy results
    setResults([
      
      
    ]);
  }, [location]);

  return (
    <div className="search-results">
      <h2>Search Results</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <a href={result.url}>{result.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultsPage;
