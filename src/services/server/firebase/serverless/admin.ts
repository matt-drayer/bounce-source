import * as admin from 'firebase-admin';

// import fs from 'fs';
// import path from 'path';

// const serviceAccount = require(`./keys/${process.env.FIREBASE_PRIVATE_KEY}`);

// const serviceAccount = JSON.parse(
//   fs.readFileSync(path.join(__dirname, `./keys/${process.env.FIREBASE_KEY_NAME}`), {
//     encoding: 'utf8',
//   }),
// );

// console.log(process.env.FIREBASE_PRIVATE_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_PRIVATE_KEY!)),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export default admin;
