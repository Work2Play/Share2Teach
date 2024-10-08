import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './SearchComponent.css';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allPDFs, setAllPDFs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const unsubscribes = [];

    const subjects = [
      'Afrikaans', 'Business', 'English', 'Geography',
      'History', 'LifeScience', 'LifeSkills', 'Maths',
      'NaturalScience', 'Technology'
    ];

    subjects.forEach((subject) => {
      const collectionRef = collection(db, `PDFS/${subject}_Main/${subject}`);
      const q = query(collectionRef, where('verified', '==', true));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setAllPDFs((prevPDFs) => {
          const updatedPDFs = [...prevPDFs];
          snapshot.docChanges().forEach((change) => {
            const pdfData = {
              ...change.doc.data(),
              id: change.doc.id,
            };
            if (change.type === "added") {
              updatedPDFs.push(pdfData);
            } else if (change.type === "modified") {
              const index = updatedPDFs.findIndex(pdf => pdf.id === pdfData.id);
              if (index > -1) {
                updatedPDFs[index] = pdfData;
              }
            } else if (change.type === "removed") {
              const index = updatedPDFs.findIndex(pdf => pdf.id === pdfData.id);
              if (index > -1) {
                updatedPDFs.splice(index, 1);
              }
            }
          });
          return updatedPDFs;
        });
      }, (error) => {
        console.error('Error fetching PDFs:', error);
      });

      unsubscribes.push(unsubscribe);
    });

    // Clean up listeners on unmount
    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  };

  // Update suggestions based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = allPDFs.filter(pdf => {
      const titleMatch = pdf.title && pdf.title.toLowerCase().includes(term);
      const tagsMatch = pdf.tags && pdf.tags.some(tag => tag.toLowerCase().includes(term));
      const subjectMatch = pdf.subject && pdf.subject.toLowerCase().includes(term);
      return titleMatch || tagsMatch || subjectMatch;
    });

    setSuggestions(filtered.slice(0, 3));
  }, [searchTerm, allPDFs]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === '') return;

    // Redirect to search results page with query parameters
    const searchParams = new URLSearchParams();
    searchParams.append('q', searchTerm);
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="search-container-small">
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Search by keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((pdf) => (
            <li key={pdf.id}>
              <a href={pdf.file_url} target="_blank" rel="noopener noreferrer">
                {pdf.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchComponent;
