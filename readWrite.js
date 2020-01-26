// Firebase App configuration
var firebaseConfig = {
    apiKey: "AIzaSyCGnqKQ3XqAuYctdKp49E_xOEnomZxaSQk",
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
// var app = firebase.initializeApp(firebaseConfig, "City Source"); //added name
const analytics = firebase.analytics(); //analytics object
// const db = firebase.database() //Database object 
const db = firebase.firestore() //Firestore noSQL database object 

//Printing info for app, analytics, and database configs
console.log(app, analytics, "\n", db)

//calling db test collection
var myDoc = db.collection('TestCollection').doc('testTest')

//printing out db value whenever updated with timestamp
myDoc.onSnapshot(currentDoc => {
    console.log("Realtime update ", new Date().toISOString(), ": ", currentDoc.data());
});

myDoc.set({
    valOne: 'Branden Taylor'
});

//printing out test docment to console with async
myDoc.get().then(function (currentDoc) {
    if (currentDoc.exists) {
        console.log("Current document data from db: ", currentDoc.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("Document doesn't exist");
    }
}).catch(function (error) {//error handling
    console.log("Error getting document: ", error);
});

myDoc.set({
    valOne: 'I changed the database'
});
