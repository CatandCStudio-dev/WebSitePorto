// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// --- PROJECT 1: AR HISTORIAN (Untuk halaman admin & legacy) ---
const firebaseConfigHistorian = {
  apiKey: "AIzaSyAW9sXTyQHd7PqAeSoVC2VvjctmpcOTREs",
  authDomain: "ar-historian-app.firebaseapp.com",
  projectId: "ar-historian-app",
  storageBucket: "ar-historian-app.firebasestorage.app",
  messagingSenderId: "780870165104",
  appId: "1:780870165104:web:2948e6f7cb17e0e98d0ab5",
  measurementId: "G-6Z3K0P1YZ6"
};

// Initialize app lama sebagai default
const appHistorian = initializeApp(firebaseConfigHistorian);
export const db = getFirestore(appHistorian);
export const auth = getAuth(appHistorian);

// --- PROJECT 2: CNC WEBSITE (Untuk Game Codenames) ---
const firebaseConfigCnc = {
  apiKey: "AIzaSyAtHHmPqpFdZrx4Q0hyXUnPmSfxjtwARzE",
  authDomain: "cnc-website-32333.firebaseapp.com",
  projectId: "cnc-website-32333",
  storageBucket: "cnc-website-32333.firebasestorage.app",
  messagingSenderId: "253340295313",
  appId: "1:253340295313:web:592816c6f983b926f75f30",
  measurementId: "G-D17R16WNZB"
};

// Initialize app baru dengan nama khusus ("cncApp") agar tidak bertabrakan
const appCnc = initializeApp(firebaseConfigCnc, "cncApp");
export const dbCnc = getFirestore(appCnc);