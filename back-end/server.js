const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('firebase-adminsdk-1j4xh@share2teach-be.iam.gserviceaccount.com');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://share2teach-be-default-rtdb.europe-west1.firebasedatabase.app"
});

// Reference to the "users" table
const database = admin.database();
const usersRef = database.ref('users');

// Function to fetch users (example for server-side usage)
function fetchUsers() {
    usersRef.once('value', (snapshot) => {
        const users = snapshot.val();
        console.log(users);
        // Process users data as needed for server-side operations
    });
}
fetchUsers(); // Call this function where you need it

app.listen(port, () => console.log(`Server running on port ${port}`));