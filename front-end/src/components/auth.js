import { useState } from "react";
import React from 'react';
import { auth, googleProvider } from "../config/firebase";
import { signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Importing the .css
import './auth.css';

export const Auth = () => {
    // State to track login status and user email
    const [loggedIn, setLoggedIn] = useState("");
    
    // State to manage visibility of login options
    const [showLoginOptions, setShowLoginOptions] = useState(false);
    const [showLogout, setLogOut] = useState(false);
    
    // State to manage form inputs
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    // Google sign-in method
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            setLoggedIn(auth.currentUser.email);
            setShowLoginOptions(false);
            setLogOut(true);
        } catch (err) {
            console.error(err);
        }
    };

    // Logout method
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setLoggedIn(false);
            console.log("User logged out.")
            navigate("/"); 
        } catch (err) {
            console.error(err);
        }
    };

    // Handle the initial login button click
    const handleLoginClick = () => {
        window.location.href = "/sign-in";
    };

    // Creating the display for buttons and form
    return (
        <div>
            {!loggedIn ? (
                <button className="login-button" onClick={() => navigate("/sign-in")}>
                    Login
                </button>
            ) : (
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            )}
        </div>
    );
};
