// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCppEPoO_OkUSoV6KpYf8P4z8dF4nGF6aU",
    authDomain: "share2teach-be.firebaseapp.com",
    projectId: "share2teach-be",
    storageBucket: "share2teach-be.appspot.com",
    messagingSenderId: "942441916410",
    appId: "1:942441916410:web:1c24d5145c785e67886643",
    databaseURL: "https://share2teach-be-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize variables
const auth = firebase.auth();
const database = firebase.database();

// Set up our register function
function register() {
    // Get all our input fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const full_name = document.getElementById('full_name').value;

    // Validate input fields
    if (!validate_email(email) || !validate_password(password)) {
        alert('Email or Password is incorrect. Try again.');
        return;
    }
    if (!validate_field(full_name)) {
        alert('Incorrect input. Please try again.');
        return;
    }

    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
        .then(function() {
            // Declare user variable
            var user = auth.currentUser;

            // Add this user to Firebase Database
            var database_ref = database.ref();

            // Create User data
            var user_data = {
                email: email,
                full_name: full_name,
                role: 'user', // Assuming a default role
                last_login: Date.now()
            };

            // Push to Firebase Database
            database_ref.child('users/' + user.uid).set(user_data);

            alert('User Created.');
        })
        .catch(function(error) {
            alert(error.message);
        });
}

// Reference to the "users" table
const usersRef = database.ref('users');

// Function to fetch users and populate the table
function fetchUsers() {
    const usersRef = database.ref('users');
    
    usersRef.on('value', (snapshot) => {
        const users = snapshot.val();

        // Create a table dynamically
        const table = document.createElement('table');
        table.setAttribute('border', '1');
        const headerRow = document.createElement('tr');

        // Define table headers
        const headers = ['Email', 'Name', 'Role'];
        headers.forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            headerRow.appendChild(header);
        });

        table.appendChild(headerRow);

        // Populate the table rows with user data
        for (const userId in users) {
            if (users.hasOwnProperty(userId)) {
                const user = users[userId];
                const row = document.createElement('tr');
                
                const emailCell = document.createElement('td');
                emailCell.textContent = user.email;
                row.appendChild(emailCell);

                const nameCell = document.createElement('td');
                nameCell.textContent = user.full_name;
                row.appendChild(nameCell);

                const roleCell = document.createElement('td');
                roleCell.textContent = user.role;
                row.appendChild(roleCell);

                table.appendChild(row);
            }
        }

        // Append the table to the document body
        document.body.appendChild(table);
    });
}

// Fetch users when the page loads
window.onload = fetchUsers;

// Set up our login function
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!validate_email(email) || !validate_password(password)) {
        alert('Email or Password is incorrect. Try again.');
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(function() {
            const user = auth.currentUser;
            var database_ref = database.ref();

            var user_data = {
                last_login: Date.now()
            };

            database_ref.child('users/' + user.uid).update(user_data);

            alert('Logged In');
        })
        .catch(function(error) {
            alert(error.message);
        });
}

// Validate Functions
function validate_email(email) {
    const expression = /^[^@]+@\w+(\.\w+)+\w$/;
    return expression.test(email);
}

function validate_password(password) {
    return password.length >= 6;
}

function validate_field(field) {
    return field != null && field.length > 0;
}
