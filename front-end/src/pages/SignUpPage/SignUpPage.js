import React, { useState } from "react";
import { auth, googleProvider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import "./SignUpPage.css";

const SignUpPage = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = (e) => {
        e.preventDefault();
        // Add your sign-up logic here
        console.log("Sign Up", { firstName, lastName, email, password });
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            console.log("User signed in with Google:", auth.currentUser.email);
            // You can redirect the user or perform other actions here
        } catch (err) {
            console.error("Google sign-in error:", err);
        }
    };

    return (
        <div className="center-wrapper">
            <div className="register-container">
                <div className="register-box">
                    <h2>Register</h2>
                    <form onSubmit={handleSignUp}>
                        <div className="input-group">
                            <span className="icon">👤</span>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <span className="icon">👤</span>
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
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
                        <button type="submit" className="sign-up-button">
                            Sign Up
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
                    <div className="already-account">
                        <span>Already Have Account ?</span> <a href="/sign-in">Sign In</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
