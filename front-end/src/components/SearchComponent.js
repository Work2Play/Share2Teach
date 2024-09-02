import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './SearchComponent.css';

function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const subjectsCollection = collection(db, 'PDFS');
      const subjectsSnapshot = await getDocs(subjectsCollection);
      const subjectsList = subjectsSnapshot.docs.map(doc => doc.id.replace('_Main', ''));
      setSubjects(subjectsList);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return; // Prevent empty searches

    try {
      let results = [];
      if (selectedSubject) {
        const q = query(
          collection(db, `PDFS/${selectedSubject}_Main/${selectedSubject}`),
          where('tags', 'array-contains', searchQuery)
        );
        const querySnapshot = await getDocs(q);
        results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } else {
        // Search across all subjects
        for (const subject of subjects) {
          const subjectQuery = query(
            collection(db, `PDFS/${subject}_Main/${subject}`),
            where('tags', 'array-contains', searchQuery)
          );
          const subjectSnapshot = await getDocs(subjectQuery);
          results.push(...subjectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      }

      // Redirect to results page with search data
      navigate('/results', { state: { results, searchQuery, selectedSubject } });
    } catch (error) {
      console.error('Error searching documents:', error);
    }
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Search by tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="subject-select"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
        <button type="submit" className="search-button">Search</button>
      </form>
    </div>
  );
}

export default SearchComponent;
