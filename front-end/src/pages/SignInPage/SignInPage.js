import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./SignInPage.css";

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);


    const handleEmailSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User signed in with email:", auth.currentUser.email);
            setEmail(""); // Clear email field
            setPassword(""); // Clear password field
            navigate("/"); // Redirect to home page
            setLoggedIn(true);
            // You can redirect the user or perform other actions here
        } catch (err) {
            console.error("Email sign-in error:", err);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            console.log("User signed in with Google:", auth.currentUser.email);
            navigate("/"); // Redirect to home page
            setLoggedIn(true);
            // You can redirect the user or perform other actions here
        } catch (err) {
            console.error("Google sign-in error:", err);
        }
    };

    return (
        <div className="center-wrapper">
            <div className="sign-in-container">
                <div className="sign-in-box">
                    <h2>Sign In</h2>
                    <form onSubmit={handleEmailSignIn}>
                        <div className="input-group">
                            <span className="icon">📧</span>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <span className="icon">🔒</span>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="sign-in-button">
                            Sign In
                        </button>
                    </form>
                    <div className="or-divider">--------- Or ---------</div>
                    <div className="social-buttons">
                        <button 
                            className="google-button" 
                            type="button" 
                            onClick={handleGoogleSignIn}>
                            G
                        </button>
                    </div>
                    <div className="sign-up-link">
                        <span>Don't have an account? </span>
                        <a href="/sign-up">Sign Up</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
