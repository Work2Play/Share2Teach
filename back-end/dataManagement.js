const admin = require('./firebase');
const db = admin.firestore();

// Define roles
const ROLES = {
  OPEN_ACCESS: 'open_access',
  EDUCATOR: 'educator',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
};

// Create or update user document after Google Sign-In
const createOrUpdateUserDocument = async (user) => {
  try {
    const { uid, email, displayName, photoURL } = user;
    const userRef = db.collection('users').doc(uid);

    const userData = {
      email,
      displayName,
      photoURL,
      role: ROLES.OPEN_ACCESS, // Default role for new users
      lastSignInTime: admin.firestore.FieldValue.serverTimestamp(),
    };

    const doc = await userRef.get();
    if (!doc.exists) {
      // If it's a new user, set createdAt
      userData.createdAt = admin.firestore.FieldValue.serverTimestamp();
      await userRef.set(userData);
      console.log(`New user document created for ${email}`);
    } else {
      // If user already exists, update lastSignInTime and other fields
      await userRef.update(userData);
      console.log(`User document updated for ${email}`);
    }

    return uid;
  } catch (error) {
    console.error('Error creating/updating user document:', error);
    throw error;
  }
};

// Get user document
const getUserDocument = async (uid) => {
  try {
    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) {
      throw new Error('User document not found');
    }
    return doc.data();
  } catch (error) {
    console.error('Error getting user document:', error);
    throw error;
  }
};

// Update user role
const updateUserRole = async (uid, newRole) => {
  try {
    if (!Object.values(ROLES).includes(newRole)) {
      throw new Error('Invalid role specified');
    }

    await db.collection('users').doc(uid).update({
      role: newRole,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Role updated to ${newRole} for user ${uid}`);
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

// Generic function to add a document to any collection
const addDocument = async (collection, data) => {
  try {
    const docRef = await db.collection(collection).add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

// Generic function to get a document from any collection
const getDocument = async (collection, id) => {
  try {
    const doc = await db.collection(collection).doc(id).get();
    if (!doc.exists) {
      throw new Error('Document not found');
    }
    return doc.data();
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

module.exports = { 
  ROLES,
  createOrUpdateUserDocument,
  getUserDocument,
  updateUserRole,
  addDocument,
  getDocument
};