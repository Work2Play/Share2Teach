import React, { useState, useEffect } from 'react';
import { db, storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, Timestamp, getDocs } from 'firebase/firestore';
import { auth } from '../config/firebase';
import './fileupload.css';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const GRADES = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export function Upload({ isOpen, onClose }) {
  const [userID, setUserID] = useState('');
  const [subject, setSubject] = useState('');
  const [subSubject, setSubSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProg, setUploadProg] = useState(0);
  const [error, setError] = useState('');
  const [subjects, setSubjects] = useState({});

  useEffect(() => {
    fetchSubjects();

    if (auth.currentUser == null)
      {
        setUserID("Default")
      } else
      {
        setUserID(auth.currentUser.email)
      }
  }, []);

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
      }
    }
  };

  const uploadHandler = async (e) => {
    e.preventDefault();

    if (!file || !subject || !subSubject || !grade || !title) {
      setError('Please fill in all required fields and select a file.');
      return;
    }

    try {
      const storageRef = ref(storage, `${subject}/${subSubject}/${file.name}`);
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
          await addDoc(collection(db, 'PDFS'), {
            userID,
            subject,
            subSubject,
            grade,
            title,
            file_url: downloadURL,
            file_name: file.name,
            file_type: file.type,
            created_at: Timestamp.now(),
          });
          alert('File uploaded successfully!');
          setUploadProg(0);
          setSubject('');
          setSubSubject('');
          setGrade('');
          setTitle('');
          setFile(null);
          setError('');
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
    <form onSubmit={uploadHandler} className="upload-form">
      <p>User: {userID}</p>
      <select
        value={subject}
        onChange={(e) => {
          setSubject(e.target.value);
          setSubSubject('');
        }}
        required
      >
        <option value="">Select Subject</option>
        {Object.keys(subjects).map((subj) => (
          <option key={subj} value={subj}>{subj}</option>
        ))}
      </select>
      {subject && (
        <select
          value={subSubject}
          onChange={(e) => setSubSubject(e.target.value)}
          required
        >
          <option value="">Select Sub-Subject</option>
          {subjects[subject].map((subSubj) => (
            <option key={subSubj} value={subSubj}>{subSubj}</option>
          ))}
        </select>
      )}
      <select
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        required
      >
        <option value="">Select Grade</option>
        {GRADES.map((g) => (
          <option key={g} value={g}>Grade {g}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input type="file" onChange={handleFileChange} required />
      {error && <p className="error-message">{error}</p>}
      <button type="submit" disabled={!!error}>Upload Document</button>
      {uploadProg > 0 && <progress value={uploadProg} max="100" />}
    </form>
  );
}