import firebase from "firebase/app";
import "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "weird-guys-309109.firebaseapp.com",
  projectId: "weird-guys-309109",
  storageBucket: "weird-guys-309109.appspot.com",
  messagingSenderId: "165311023834",
  appId: "1:165311023834:web:f7dc52aaeb5515864ab3e3",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

export default firebase;
