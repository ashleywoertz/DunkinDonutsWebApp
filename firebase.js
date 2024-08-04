// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfpqjJT-u0dfDDPM0G3q-xrgE34df2FNs",
  authDomain: "grocery-store-ea22c.firebaseapp.com",
  projectId: "grocery-store-ea22c",
  storageBucket: "grocery-store-ea22c.appspot.com",
  messagingSenderId: "913770809139",
  appId: "1:913770809139:web:0ebe59510beb431ebe6046"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export{firestore}