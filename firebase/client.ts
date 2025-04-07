// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3uLyYz2ARnN4aTpTHsb1-geD0H5zQG_E",
  authDomain: "prepwiser-bc8b8.firebaseapp.com",
  projectId: "prepwiser-bc8b8",
  storageBucket: "prepwiser-bc8b8.firebasestorage.app",
  messagingSenderId: "1047681160009",
  appId: "1:1047681160009:web:e186cb1ad971af371d4098",
  measurementId: "G-7DTLJZ17Y7"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };