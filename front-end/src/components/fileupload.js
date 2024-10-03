import React, { useState, useEffect } from 'react';
import { db, storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth } from '../config/firebase';
import './fileupload.css';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const GRADES = ['Grade K', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

export function Upload({ isOpen, onClose }) {
  const [userID, setUserID] = useState('');
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProg, setUploadProg] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [selectedGrades, setSelectedGrades] = useState([]); 
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubjects();

    if (auth.currentUser == null) {
      setUserID("Default");
    } else {
      setUserID(auth.currentUser.email);
    }

  }, []);

  const fetchSubjects = async () => {
    try {
      const rootRef = ref(storage);
      const result = await listAll(rootRef);
      const subjectNames = result.prefixes.map((folderRef) => folderRef.name);
      setSubjects(subjectNames);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('File is too large. Maximum size is 10MB.');
        setFile(null);
      } else if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        setError('Invalid file type. Please upload a PDF or Word document.');
        setFile(null);
      } else {
        setFile(selectedFile);
        setError('');

        if (!title) {
          setTitle(selectedFile.name);
        }
      }
    }
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleGradeSelect = (e) => {
    const grade = e.target.value;
    if (!selectedGrades.includes(grade)) {
      setSelectedGrades([...selectedGrades, grade]);
    }
  };

  const handleRemoveGrade = (gradeToRemove) => {
    setSelectedGrades(selectedGrades.filter(grade => grade !== gradeToRemove));
  };

  const uploadHandler = async (e) => {
    e.preventDefault();

    if (!file || !subject) {
      setError('Please fill in all required fields and select a file.');
      return;
    }

    try {
      const storageRef = ref(storage, `${subject}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProg(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setError('File upload failed. Please try again.');
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, `PDFS/${subject}_Main/${subject}`), {
            userID,
            subject,
            title: title || file.name,
            file_url: downloadURL,
            tags: [...tags, ...selectedGrades],
            modifiedAt: Timestamp.now(),
          });
          alert('File uploaded successfully!');
          setUploadProg(0);
          setSubject('');
          setTitle('');
          setFile(null);
          setTags([]);
          setSelectedGrades([]);
          onClose();
        }
      );
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('An error occurred while uploading the file. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="upload-popup">
      <div className="upload-header">
        <p>User: {userID}</p>
        <button className="close-button" onClick={onClose}>X</button> {/* Close button */}
      </div>
      <form onSubmit={uploadHandler} className="upload-form">
        <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
          <option value="" disabled>Select Subject</option>
          {subjects.map((subj) => (
            <option key={subj} value={subj}>{subj}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Title (If left blank, the file name will be used)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input type="file" onChange={handleFileChange} required />
        {error && <p className="error-message">{error}</p>}

        {/* Grade Selector */}
        <select onChange={handleGradeSelect}>
          <option value="">Select Grade</option>
          {GRADES.map((grade) => (
            <option key={grade} value={grade}>{grade}</option>
          ))}
        </select>
        <div>
          {selectedGrades.map((grade, index) => (
            <span key={index} className="tag">
              {grade}
              <button type="button" onClick={() => handleRemoveGrade(grade)}>x</button>
            </span>
          ))}
        </div>

        <div>
          <input
            type="text"
            placeholder="Add a tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button type="button" onClick={handleAddTag}>Add Tag</button>
        </div>
        <div>
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
              <button type="button" onClick={() => handleRemoveTag(tag)}>x</button>
            </span>
          ))}
        </div>

        <button type="submit" disabled={!!error}>Upload Document</button>
        {uploadProg > 0 && <progress value={uploadProg} max="100" />}
      </form>
    </div>
  );
}
