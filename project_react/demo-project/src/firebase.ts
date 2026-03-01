// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvk-TkCMUmeHf_Fj1fqubhgrf1BML4AtE",
  authDomain: "fir-project-cbc99.firebaseapp.com",
  projectId: "fir-project-cbc99",
  storageBucket: "fir-project-cbc99.firebasestorage.app",
  messagingSenderId: "177726042704",
  appId: "1:177726042704:web:f6b88177b81ca2ea3ed755",
  measurementId: "G-S2V82SXQ0M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);