//all related to login and logout button
import { useState } from "react";

import { auth, googleProvider } from ".../config/firebase"
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";

export const Auth = () => {
    //gets the user that is currently logged in
    const [logedIn, setLoggedIn] = useState("");

    //creates a popup window for user to sign in with their google account
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
            setLoggedIn(auth.currentUser.email)
        } catch (err)
        {
            console.error(err);
        }
    }

    //created a button for user to logout from current account
    const logout = async () => {
        try {
            await signOut(auth)
            setLoggedIn( )
        } catch (err)
        {
            console.error(err);
        }
    }

    //creating basic display for the buttons
    return (
        <div>
            <button className="login-button" onclick={signInWithGoogle}>Login</button>
            <h1 className="userLoged">{logedIn}</h1>
            <button className="logout-button" onclick={logout}>Logout</button>
        </div>
    )

}
