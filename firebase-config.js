// firebase-config.js
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBfK4lAXxgw-WwlktWyibL_P8UCDoRJ5A",
  authDomain: "intimawell-14632.firebaseapp.com",
  projectId: "intimawell-14632",
  storageBucket: "intimawell-14632.firebasestorage.app",
  messagingSenderId: "969634105147",
  appId: "1:969634105147:web:83d793fd3c7169ce9c591e",
  measurementId: "G-NGRX6RKMEW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();

// Export for use in other files
window.firebase = firebase;
window.auth = auth;
window.db = db;