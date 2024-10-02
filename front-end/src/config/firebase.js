// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

//for user login
import { getAuth, GoogleAuthProvider} from "firebase/auth";

//getting the firestore database
import { getFirestore } from 'firebase/firestore';

import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCppEPoO_OkUSoV6KpYf8P4z8dF4nGF6aU",
  authDomain: "share2teach-be.firebaseapp.com",
  databaseURL: "https://share2teach-be-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "share2teach-be",
  storageBucket: "share2teach-be.appspot.com",
  messagingSenderId: "942441916410",
  appId: "1:942441916410:web:1c24d5145c785e67886643",
  measurementId: "G-SXGLL4M7VW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

//for user login
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

//the adding a variable to store the database
export const db = getFirestore(app);

//a variable to get the storae of the firestore
export const storage = getStorage(app);