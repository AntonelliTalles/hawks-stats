// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC85jOYR-C4mB7AyXJTkc-h_9yDQNgGDso',
  authDomain: 'hawks-stats.firebaseapp.com',
  projectId: 'hawks-stats',
  storageBucket: 'hawks-stats.firebasestorage.app',
  messagingSenderId: '998964135685',
  appId: '1:998964135685:web:3248ccb84f458f24e1596c',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
