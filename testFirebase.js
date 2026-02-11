"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("firebase/app");
var auth_1 = require("firebase/auth");
var firestore_1 = require("firebase/firestore");
var firebaseConfig = {
    apiKey: "AIzaSyD8F-HgI3Xpi2WRtT1bzzVAFbaOa3j23fI",
    authDomain: "mindease-cd0e1.firebaseapp.com",
    projectId: "mindease-cd0e1",
    storageBucket: "mindease-cd0e1.firebasestorage.app",
    messagingSenderId: "854674232878",
    appId: "1:854674232878:web:c2e39be8fb7b496e58f1bf"
};
var app = (0, app_1.initializeApp)(firebaseConfig);
var auth = (0, auth_1.getAuth)(app);
var db = (0, firestore_1.getFirestore)(app);
console.log("Firebase connected successfully!");
