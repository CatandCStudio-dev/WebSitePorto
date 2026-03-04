// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // TAMBAHKAN INI

const firebaseConfig = {
  apiKey: "AIzaSyAW9sXTyQHd7PqAeSoVC2VvjctmpcOTREs",
  authDomain: "ar-historian-app.firebaseapp.com",
  projectId: "ar-historian-app",
  storageBucket: "ar-historian-app.firebasestorage.app",
  messagingSenderId: "780870165104",
  appId: "1:780870165104:web:2948e6f7cb17e0e98d0ab5",
  measurementId: "G-6Z3K0P1YZ6"
};

const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
export const auth = getAuth(app); // TAMBAHKAN INI UNTUK EXPORT AUTH