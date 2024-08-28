import React, { useState } from "react";
import { auth, googleProvider} from "../../config/firebase";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";

const SignUpPage = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const db = getFirestore();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Combine first name and last name
            const full_name = `${firstName} ${lastName}`;

            // Save user data to Firestore
            await setDoc(doc(db, "users", user.uid), {
                full_name: full_name,
                email: email,
                role: "open access user"
            });

            console.log("User signed up successfully:", user.email);
            navigate("/");
            // You can redirect the user or perform other actions here
        } catch (error) {
            console.error("Error signing up:", error);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Save Google user data to Firestore
            await setDoc(doc(db, "users", user.uid), {
                full_name: user.displayName,
                email: user.email,
                role: "open access user"
            });

            console.log("User signed in with Google:", user.email);
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
                        <button type="submit" className="sign-up-button"
                            onClick={handleSignUp}>
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