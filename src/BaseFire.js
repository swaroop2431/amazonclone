// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdIjQSLpcGj-U7AgFXCxRSXLrwF8Dn-9Q",
  authDomain: "clone-a2247.firebaseapp.com",
  projectId: "clone-a2247",
  storageBucket: "clone-a2247.appspot.com",
  messagingSenderId: "778271060943",
  appId: "1:778271060943:web:073dbcaba585a2d4f818ba",
  measurementId: "G-XNKEE58SM5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);