const path = require('path');
const envPathProd = path.join(__dirname, '../../.env.production');
const envPathDev = path.join(__dirname, '../../.env.development');
const envPath = process.env.NODE_ENV === 'production' ? envPathProd : envPathDev;
require('dotenv').config({ path: envPath });
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_PRIVATE_KEY)),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    authProviderX509CertUrl: true,
  });
}

console.log('admin', admin);

module.exports = admin;
