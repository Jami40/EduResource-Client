// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

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
export const storage = getStorage(app); 