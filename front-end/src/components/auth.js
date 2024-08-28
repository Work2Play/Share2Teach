import { useState } from "react";
import React from 'react';
import { auth, googleProvider } from "../config/firebase";
import { signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

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

    // Email and password sign-in method
    const signInWithEmail = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoggedIn(auth.currentUser.email);
            setShowLoginOptions(false);
            setLogOut(true);
        } catch (err) {
            console.error(err);
        }
    };

    // Email and password sign-up method
    const signUpWithEmail = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setLoggedIn(auth.currentUser.email);
            setShowLoginOptions(false);
            setLogOut(true);
        } catch (err) {
            console.error(err);
        }
    };

    // Logout method
    const logout = async () => {
        try {
            await signOut(auth);
            setLoggedIn("");
            setShowLoginOptions(false);
            setLogOut(false);
        } catch (err) {
            console.error(err);
        }
    };

    // Handle the initial login button click
    const handleLoginClick = () => {
        setShowLoginOptions(true);
    };

    // Creating the display for buttons and form
    return (
        <div>
            {!loggedIn && !showLoginOptions && (
                <button className="login-button" onClick={handleLoginClick}>
                    Login
                </button>
            )}
            {showLoginOptions && (
                <>
                    <button className="login-button" onClick={signInWithGoogle}>Login with Google</button>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button className="login-button" onClick={signInWithEmail}>Login with Email</button>
                        <button className="signup-button" onClick={signUpWithEmail}>Sign Up</button>
                    </form>
                </>
            )}
            {showLogout && (
                <>
                    <p className="userLogged">{loggedIn}</p>
                    <button className="logout-button" onClick={logout}>Logout</button>
                </>
            )}
        </div>
    );
};
