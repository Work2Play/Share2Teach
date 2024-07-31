//all related to login and logout button
import { useState } from "react";

import { auth, googleProvider } from "../config/firebase"
import { signInWithPopup, signOut } from "firebase/auth";

//importing the .css
import './auth.css';

export const Auth = () => {
    //gets the user that is currently logged in
    const [logedIn, setLoggedIn] = useState("");

    //variables to hide or show the buttons and loggedin text
    const [showLogin, setLogin] = useState(true);
    const [showLogout, setLogOut] = useState(false);

    //creates a popup window for user to sign in with their google account
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
            setLoggedIn(auth.currentUser.email)
            setLogin(false)
            setLogOut(true)
        } catch (err)
        {
            console.error(err);
        }
    }

    //created a button for user to logout from current account
    const logout = async () => {
        try {
            await signOut(auth)
            setLoggedIn()
            setLogin(true)
            setLogOut(false)
        } catch (err)
        {
            console.error(err);
        }
    }

    //creating basic display for the buttons
    return (
        <div>
            {showLogin && <button className="login-button" onClick={signInWithGoogle}>Login</button>}
            {showLogout && <p className="userLoged">{logedIn}</p>}
            {showLogout && <button className="logout-button" onClick={logout}>Logout</button>}
        </div>
        
    )
}
