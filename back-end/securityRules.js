const admin = require('./firebase');

const ROLES = {
  OPEN_ACCESS: 'open_access',
  EDUCATOR: 'educator',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
};

// Middleware to check if the user is authenticated
const isAuthenticated = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to check if the user has the required role
const hasRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role || ROLES.OPEN_ACCESS;

    if (Array.isArray(allowedRoles) ? allowedRoles.includes(userRole) : allowedRoles === userRole) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
};

// Specific middleware for each role
const isAdmin = hasRole(ROLES.ADMIN);
const isModerator = hasRole([ROLES.MODERATOR, ROLES.ADMIN]);
const isEducator = hasRole([ROLES.EDUCATOR, ROLES.MODERATOR, ROLES.ADMIN]);

// Middleware to check if the user is accessing their own data
const isOwnResource = (paramName = 'uid') => {
  return (req, res, next) => {
    if (req.user.uid === req.params[paramName] || req.user.role === ROLES.ADMIN) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  };
};

module.exports = {
  ROLES,
  isAuthenticated,
  hasRole,
  isAdmin,
  isModerator,
  isEducator,
  isOwnResource
};