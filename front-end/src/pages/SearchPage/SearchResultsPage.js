import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchResultsPage.css';

import { db } from '../../config/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';

const GRADES = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const SearchResultsPage = () => {
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubSubject, setSelectedSubSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [subjects, setSubjects] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
    const searchParams = new URLSearchParams(location.search);
    const queryTerm = searchParams.get('q');
    const subject = searchParams.get('subject');
    const subSubject = searchParams.get('subSubject');
    const grade = searchParams.get('grade');
    setSearchTerm(queryTerm || '');
    setSelectedSubject(subject || '');
    setSelectedSubSubject(subSubject || '');
    setSelectedGrade(grade || '');

    if (queryTerm) {
      fetchResults(queryTerm, subject, subSubject, grade);
    }
  }, [location]);

  const fetchSubjects = async () => {
    try {
      const subjectsRef = collection(db, 'Subjects');
      const subjectsSnapshot = await getDocs(subjectsRef);
      const subjectsData = {};
      subjectsSnapshot.forEach(doc => {
        subjectsData[doc.id] = doc.data().subSubjects;
      });
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchResults = async (term, subject, subSubject, grade) => {
    try {
      let searchQuery = query(collection(db, 'PDFS'));

      if (term) {
        searchQuery = query(searchQuery, 
          where('title', '>=', term),
          where('title', '<=', term + '\uf8ff')
        );
      }
      if (subject) {
        searchQuery = query(searchQuery, where('subject', '==', subject));
      }
      if (subSubject) {
        searchQuery = query(searchQuery, where('subSubject', '==', subSubject));
      }
      if (grade) {
        searchQuery = query(searchQuery, where('grade', '==', grade));
      }

      const data = await getDocs(searchQuery);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setResults(filteredData);
    } catch (err) {
      console.error("Error fetching search results:", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.set('q', searchTerm);
    if (selectedSubject) searchParams.set('subject', selectedSubject);
    if (selectedSubSubject) searchParams.set('subSubject', selectedSubSubject);
    if (selectedGrade) searchParams.set('grade', selectedGrade);
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
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSelectedSubSubject('');
            }}
            className="subject-select"
          >
            <option value="">All Subjects</option>
            {Object.keys(subjects).map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          {selectedSubject && (
            <select
              value={selectedSubSubject}
              onChange={(e) => setSelectedSubSubject(e.target.value)}
              className="sub-subject-select"
            >
              <option value="">All Sub-Subjects</option>
              {subjects[selectedSubject].map((subSubject) => (
                <option key={subSubject} value={subSubject}>{subSubject}</option>
              ))}
            </select>
          )}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="grade-select"
          >
            <option value="">All Grades</option>
            {GRADES.map((grade) => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </select>
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>
      <div className="results-container">
        {results.length > 0 ? (
          <table className="results-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Sub-Subject</th>
                <th>Grade</th>
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
                  <td>{result.subject}</td>
                  <td>{result.subSubject}</td>
                  <td>{result.grade}</td>
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