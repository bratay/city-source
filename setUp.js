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

googleSignIn()

function googleSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider(); //Google sign in object

    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. we can use it to access the Google API.
        var token = result.credential.accessToken;

        console.log(result)
        console.log('Google sign in works! user: ', result.user, '\n email: ', user.email)
    }).catch(function (error) {
        console.log('Sign in fail! Error message: ', error.message)
    });
}

//A differnent way to sign in but I can't get it to work

// function googleSignIn() {
//     //sign in configuration 
//     var uiConfig = {
//         //page loaded after user signs in 
//         signInSuccessUrl: 'loggedIn.html',
//         signInOptions: [
//             {
//                 firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//             }
//         ],
//         //url to our terms of service
//         // tosUrl: '<the url For terms of service>'
//     }

//     // Initialize the FirebaseUI Widget using Firebase.
//     var ui = new firebaseui.auth.AuthUI(firebase.auth());

//     ui.start('#firebaseui-auth-container', uiConfig);
// }