import React, { useState } from "react";
import { db, storage} from "../config/firebase";
//import { getUnpackedSettings } from "http2";

//Importing .css
import './fileupload.css';

//Create state variables for storing 
export function Upload( {isOpen, onClose} ) {
    const [userID, getUserID] = useState("");
    const [subject, getSubject] = useState("");
    const [title, getTitle] = useState("");
    const [file, getFile] = useState(null);
    const [uploadprog, getUploadprog] = useState(0);

    if (!isOpen) return null;

    //sets File state to first selected file when a file is chosen from the file input
    const filechange = (e) => {
        getFile(e.target.files[0]);
    };

    //handles document submission 
    const uploadhandler = async (e) => {
        e.preventDefault();

        if(!file){
            alert("File not selected!");
        return;
    }
        // gets reference for firebase storage root, reffile creates ref to location where file will be stored in the storage, and finally starts upload process
        const refstorage = storage.ref();
        const reffile = refstorage.child('${subject}/${file.name}')
        const uploadprocess = reffile.put(file);

        //tracks the progress of the upload and handles completion
        uploadprocess.on(
            "state_changed", 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                getUploadprog(progress);
            },
            (error) => {
                console.error("Error Uploading:", error);
            },

            async () => {
                const file_url = await reffile.getDownloadURL(); //waits for firebase storage to give the download url for the file that was uploaded and database
                const refdoc = db.collection("documents").doc();

                //waits for firestore to create new document with the given details
                await refdoc.set({
                    userID,
                    subject,
                    title,
                    file_url,   //Stores the file's download urls in firestore
                    modifiedAt: Date.getTime()

                });

                alert("Successfully uploaded document.");
                getUploadprog(0);
                getFile(null);
                getSubject("");
                getTitle("");
            }
        );
    };

    //captures the required fields
    return (
        <form onSubmit={uploadhandler}>
            <input
                type="text"
                placeholder="User Id"
                value={userID}
                onChange={(e) => getUserID(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="subject"
                value={subject}
                onChange={(e) => getSubject(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="title"
                value={title}
                onChange={(e) => getTitle(e.target.value)}
                required
            />
            <input type="file" onChange={filechange} required />
            <button type="submit" onClick={onClose}>Upload Document</button>
            {uploadprog >0 && <progress value={uploadprog} max="100" />}
        </form>
    );
};




