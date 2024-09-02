// Import necessary modules
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For programmatic navigation
import './SearchComponent.css';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State to store the search input
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Function to handle form submission
  const handleSearch = (event) => {
    event.preventDefault(); // Prevent default form submission
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`); // Navigate to SearchResultsPage with the search term as a query parameter
      setSearchTerm(''); // Clear the search input
    }
  };

  return (
    <form className="search-form" onSubmit={handleSearch}>
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update state with input value
      />
      <button type="submit" className="search-button">Search</button>
    </form>
  );
};

export default SearchComponent;
