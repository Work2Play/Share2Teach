import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "./SignInPage.css";

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [showPopup, setShowPopup] = useState(false);

    const handleEmailSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User signed in with email:", auth.currentUser.email);
            setEmail(""); // Clear email field
            setPassword(""); // Clear password field
            setLoginAttempts(0); // Reset login attempts
            setLoggedIn(true);
            navigate("/"); // Redirect to home page
        } catch (err) {
            console.error("Email sign-in error:", err);
            setLoginAttempts(prev => prev + 1);
            if (loginAttempts >= 2) { // Show pop-up on the 3rd failed attempt
                setShowPopup(true);
                // Optionally, disable the account here
                console.warn("Account may be disabled after multiple failed attempts.");
            }
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            console.log("User signed in with Google:", auth.currentUser.email);
            setLoginAttempts(0); // Reset login attempts
            setLoggedIn(true);
            navigate("/"); // Redirect to home page
        } catch (err) {
            console.error("Google sign-in error:", err);
        }
    };

    useEffect(() => {
        console.log("SignInPage component loaded");
    }, []);

    const closePopup = () => {
        setShowPopup(false);
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
                            <div className="subject-card">
                                <Link to="/sign-up">Sign Up</Link>
                            </div>
                        </div>
                    </div>
                </div>

            {/* Pop-up for too many failed attempts */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <p>Too many failed login attempts. Your account may be disabled temporarily for security reasons.</p>
                        <button className="close-button" onClick={closePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignInPage;
