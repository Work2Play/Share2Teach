const express = require('express');
const admin = require('./firebase');
const { createOrUpdateUserDocument, ROLES } = require('./dataManagement');
const { requireRole } = require('./userManagement');  // Assuming you have this middleware

const app = express();

// Middleware
app.use(express.json());

// Google Sign-In route
app.post('/api/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Get the user's details from Firebase Auth
    const user = await admin.auth().getUser(decodedToken.uid);
    
    // Create or update the user document in Firestore
    await createOrUpdateUserDocument(user);
    
    res.status(200).json({ message: 'Authentication successful', user: user });
  } catch (error) {
    console.error('Error in Google Sign-In:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

app.put('/api/users/:uid/role', requireRole(ROLES.ADMIN), async (req, res) => {
    try {
      const { uid } = req.params;
      const { newRole } = req.body;
  
      if (!Object.values(ROLES).includes(newRole)) {
        return res.status(400).json({ error: 'Invalid role specified' });
      }
  
      await updateUserRole(uid, newRole);
      res.json({ message: 'Role updated successfully' });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ error: 'Failed to update user role' });
    }
  });

// Example protected route
app.get('/api/protected', requireRole([ROLES.OPEN_ACCESS, ROLES.EDUCATOR, ROLES.MODERATOR, ROLES.ADMIN]), (req, res) => {
  res.json({ message: 'This is a protected route' });
});

// Example admin-only route
app.get('/api/admin', requireRole(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'This is an admin-only route' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});