import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyD8F-HgI3Xpi2WRtT1bzzVAFbaOa3j23fI",
  authDomain: "mindease-cd0e1.firebaseapp.com",
  projectId: "mindease-cd0e1",
  storageBucket: "mindease-cd0e1.firebasestorage.app",
  messagingSenderId: "854674232878",
  appId: "1:854674232878:web:c2e39be8fb7b496e58f1bf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("Firebase connected successfully!");
