import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import './SearchComponent.css';

function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return; // Prevent empty searches
    console.log("Search for:", searchQuery); // Placeholder logic for search
  };

  return (
    <form className="search-form" onSubmit={handleSearch}>
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit" className="search-button">Search</button> {/* Moved inline with input */}
    </form>
  );
}

export default SearchComponent;