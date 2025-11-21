// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUeEMpxpzZ864HVU8OU69uQ6HH1LYX0dA",
  authDomain: "imagen-ia-845a3.firebaseapp.com",
  projectId: "imagen-ia-845a3",
  storageBucket: "imagen-ia-845a3.firebasestorage.app",
  messagingSenderId: "134868092813",
  appId: "1:134868092813:web:ac1c73912979df59a25fc4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, onSnapshot, query, orderBy };
