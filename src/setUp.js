// This file will setup our app and run all intial code 
// needed before the user does anything

// Firebase App configuration
var firebaseConfig = {
    apiKey: "YOU SHOULD HAVE THIS IF NOT ASK",
    authDomain: "city-source-8a88a.firebaseapp.com",
    databaseURL: "https://city-source-8a88a.firebaseio.com",
    projectId: "city-source-8a88a",
    storageBucket: "city-source-8a88a.appspot.com",
    messagingSenderId: "116800112457",
    appId: "1:116800112457:web:e63f46689ea51c11437c98",
    measurementId: "G-D07D7LCMPR"
};

// Initialize Firebase
var app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore() //Firestore noSQL database object 
