import React, { useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Importing the CSS file
import './auth.css';

export const Auth = () => {
    // State to track login status and user email
    const [loggedIn, setLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const navigate = useNavigate();

    // Logout method
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setLoggedIn(false);
            setUserEmail("");
            console.log("User logged out.");
            navigate("/"); // Redirect to home page after logout
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    // Handle the initial login button click to redirect to sign-in page
    const handleLoginClick = () => {
        navigate("/sign-in"); // Redirect to the sign-in page
    };

    // Check if the user is already logged in
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setLoggedIn(true);
                setUserEmail(user.email);
            } else {
                setLoggedIn(false);
                setUserEmail("");
            }
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    return (
        <div className="your-component-container">
            {loggedIn ? (
                <div className="logged-in-section">
                    <p>Signed in as {userEmail}</p>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            ) : (
                <button className="login-button" onClick={handleLoginClick}>
                    Login
                </button>
            )}
        </div>
    );
};

export default Auth;
