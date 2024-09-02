import React, { useEffect, useState } from 'react'; // useState is to manage the state variables, and useEffect perfrom side effects such as fetching data when the component loads
import { db, storage } from '../config/firebase'; 
import { ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage'; //ref creates a reference to a location in firebase storage, uploadBytesResumable uploads files to firebase storage that also can monitor the upload progress, and listAll lists all the folders within the firebase storage
import { collection, addDoc, Timestamp } from 'firebase/firestore'; // collection to get a reference to  a firestore collection, addDoc to add a new document to a collcetion in firestore
import { auth } from '../config/firebase'; //the userID, the person currently signed
import './fileupload.css';

export function Upload({ isOpen, onClose }) {
    //Create state variables for storing
  const [userID, setUserID] = useState('');
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProg, setUploadProg] = useState(0);
  const [subjects, setSubjects] = useState([]);

  // call fetchSubjects function to populate the subjects state with folder names from Storage
  useEffect(() => {
    fetchSubjects();
    setUserID(auth.currentUser.email)
  }, []);

  // fetches subject folders from Storage
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
  //sets File state to first selected file when a file is chosen from the file input
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  //handles the actual file upload
  const uploadHandler = async (e) => {
    // e.preventDefault() stop the form from refreshing the page when file is submitted
    e.preventDefault();

    //checks if a file was selected
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    try {
      const storageRef = ref(storage, `${subject}/${file.name}`); //storage ref is created with the selected subject and file name
      const uploadTask = uploadBytesResumable(storageRef, file); //the file is uploaded using uploadBytesResumable that can track the progress of the upload

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProg(progress); //state_changed event listener updates the uploadProg state as the file upload happens
        },
        (error) => {
          console.error('Upload error:', error); //Logs the upload errors
        },
        //when the upload is completed this part is for storing the metadata in firestore where it gets the download url and a new document is added to firestore with the metadata of the file
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            //storing the metadata in the correct Firestore path
          await addDoc(collection(db, `PDFS/${subject}_Main/${subject}`), { //uses the subject name that was selected in dropdown list
            userID,
            subject,
            title,
            file_url: downloadURL,
            modifiedAt: Timestamp.now(),
          });
          alert('File uploaded successfully!');
          setUploadProg(0);
          setSubject('');
          setTitle('');
          setFile(null);
          onClose();
        }
      );
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  if (!isOpen) return null; //The form is rendered the isOpen prop is true

  //captures the required fields, a dropdown list to choose the subject, a progress bar is displayed and the uploadHandler function handles the form submission 
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
      <button type="submit">Upload Document</button>
      {uploadProg > 0 && <progress value={uploadProg} max="100" />}
    </form>
  );
}
