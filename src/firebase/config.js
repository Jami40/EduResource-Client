// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-auth-domain",
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-storage-bucket",
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "your-messaging-sender-id",
//   appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firebase Authentication and get a reference to the service
// export const auth = getAuth(app);
// export const db = getFirestore(app);

// export default app; 

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCH5ZXBJcunu5nsYj-Gr3RL6UHrMaPoX1M",
  authDomain: "eduresource-11d43.firebaseapp.com",
  projectId: "eduresource-11d43",
  storageBucket: "eduresource-11d43.firebasestorage.app",
  messagingSenderId: "162733944469",
  appId: "1:162733944469:web:e1fe8688aa4371bb31b59c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);