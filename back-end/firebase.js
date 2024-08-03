const admin = require('firebase-admin');
const serviceAccount = require('./config/share2teach-be-firebase-adminsdk-1j4xh-8b5927dc1a.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://share2teach-be-default-rtdb.europe-west1.firebasedatabase.app'
});

module.exports = admin;