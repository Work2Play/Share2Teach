import React, { useState } from "react";
import { auth, googleProvider } from "../../config/firebase";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom"; // Import Link
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
        role: "open access user",
      });

      console.log("User signed up successfully:", user.email);
      navigate("/"); // Redirect to home page
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
        role: "open access user",
      });

      console.log("User signed in with Google:", user.email);
      navigate("/"); // Redirect to home page
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
            <button className="google-button" type="button" onClick={handleGoogleSignIn}>
              G
            </button>
          </div>
          <div className="already-account">
            <span>Already Have Account?</span>{" "}
            <Link to="/sign-in">Sign In</Link> {/* Use Link instead of <a> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
