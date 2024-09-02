import React, { useEffect, useState } from 'react';
import { db, storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth } from '../config/firebase';
import './fileupload.css';

export function Upload({ isOpen, onClose }) {
  const [userID, setUserID] = useState('');
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProg, setUploadProg] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

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
      const rootRef = ref(storage);
      const result = await listAll(rootRef);
      const subjectNames = result.prefixes.map((folderRef) => folderRef.name);
      setSubjects(subjectNames);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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

  const uploadHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload.');
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
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, `PDFS/${subject}_Main/${subject}`), {
            userID,
            subject,
            title,
            file_url: downloadURL,
            tags,
            modifiedAt: Timestamp.now(),
          });
          alert('File uploaded successfully!');
          setUploadProg(0);
          setSubject('');
          setTitle('');
          setFile(null);
          setTags([]);
          onClose();
        }
      );
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <form onSubmit={uploadHandler} className="upload-form">
      <p>{userID}</p>
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      >
        <option value="" disabled>
          Select Subject
        </option>
        {subjects.map((subj) => (
          <option key={subj} value={subj}>
            {subj}
          </option>
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
      <button type="submit">Upload Document</button>
      {uploadProg > 0 && <progress value={uploadProg} max="100" />}
    </form>
  );
}