const admin = require('./firebase');

// Define roles
const ROLES = {
  OPEN_ACCESS: 'open_access',
  EDUCATOR: 'educator',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
};

const createOrUpdateUser = async (userRecord) => {
  try {
    const { uid, email, displayName, photoURL } = userRecord;

    // Check if the user already exists in Firestore
    const userDoc = await admin.firestore().collection('users').doc(uid).get();

    if (!userDoc.exists) {
      // If the user doesn't exist, create a new user document
      await admin.firestore().collection('users').doc(uid).set({
        email,
        displayName,
        photoURL,
        role: ROLES.OPEN_ACCESS,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Set custom claims for the new user
      await admin.auth().setCustomUserClaims(uid, { role: ROLES.OPEN_ACCESS });

      console.log(`New user created: ${email}`);
    } else {
      // If the user exists, update their information
      await admin.firestore().collection('users').doc(uid).update({
        email,
        displayName,
        photoURL,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`Existing user updated: ${email}`);
    }

    return userRecord;
  } catch (error) {
    console.error('Error in createOrUpdateUser:', error);
    throw error;
  }
};

const getUserRole = async (uid) => {
  try {
    const user = await admin.auth().getUser(uid);
    return user.customClaims?.role || ROLES.OPEN_ACCESS;
  } catch (error) {
    console.error('Error getting user role:', error);
    throw error;
  }
};

const changeUserRole = async (uid, newRole) => {
  try {
    if (!Object.values(ROLES).includes(newRole)) {
      throw new Error('Invalid role specified');
    }

    await admin.auth().setCustomUserClaims(uid, { role: newRole });
    
    await admin.firestore().collection('users').doc(uid).update({
      role: newRole
    });

    return { success: true, message: `User role updated to ${newRole}` };
  } catch (error) {
    console.error('Error changing user role:', error);
    throw error;
  }
};

const verifyIdToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
};

// Middleware for role-based access control
const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      const idToken = req.headers.authorization?.split('Bearer ')[1];
      if (!idToken) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decodedToken = await verifyIdToken(idToken);
      const userRole = decodedToken.role || ROLES.OPEN_ACCESS;

      if (Array.isArray(roles) ? roles.includes(userRole) : roles === userRole) {
        req.user = decodedToken;
        next();
      } else {
        res.status(403).json({ error: 'Insufficient permissions' });
      }
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};

module.exports = { 
  ROLES,
  createOrUpdateUser,
  getUserRole,
  changeUserRole,
  verifyIdToken,
  requireRole
};