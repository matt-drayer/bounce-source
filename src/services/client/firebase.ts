// import { getAnalytics } from 'firebase/analytics';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth, indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getIsNativePlatform } from 'utils/mobile/getIsNativePlatform';

// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
// import 'firebase/compat/storage';

// TODO: This needs to be updated to newer firebase code and is currently using backward compatibility code

// NOTE: CHANGE THESE
const DEV_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'bounce-team-staging.firebaseapp.com',
  projectId: 'bounce-team-staging',
  storageBucket: 'bounce-team-staging.appspot.com',
  messagingSenderId: '7311165304',
  appId: '1:7311165304:web:221bd672be48fc71adea8d',
  databaseURL: 'https://bounce-team-staging-default-rtdb.firebaseio.com/',
  measurementId: 'G-GE2118T9KV',
};

const PROD_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'bounce-team.firebaseapp.com',
  databaseURL: 'https://bounce-team-default-rtdb.firebaseio.com',
  projectId: 'bounce-team',
  storageBucket: 'bounce-team.appspot.com',
  messagingSenderId: '111309941411',
  appId: '1:111309941411:web:d6a40bf18524ab27b26d16',
  measurementId: 'G-S5LD40MPE0',
};

export const firebaseConfig = process.env.APP_STAGE !== 'production' ? DEV_CONFIG : PROD_CONFIG;

let app: FirebaseApp | undefined;

if (!app) {
  app = initializeApp(firebaseConfig);
}

let auth: Auth;
if (getIsNativePlatform()) {
  auth = initializeAuth(app, { persistence: indexedDBLocalPersistence });
} else {
  auth = getAuth(app);
}
const storage = getStorage(app);
const database = getDatabase(app);
let analytics;
if (typeof window !== 'undefined') {
  // analytics = getAnalytics(app);
}

if (process.env.APP_STAGE !== 'production') {
  console.log(app.name ? 'Firebase Mode Activated!' : 'Firebase not working :(');
}

export { auth, storage, database, analytics };
