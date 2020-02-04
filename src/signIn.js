import * as firebase from 'firebase';

export function googleSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider(); //Google sign in object

    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. we can use it to access the Google API.
        var token = result.credential.accessToken;
        console.log(result) // For testing
        
    }).catch(function (error) {
        console.log('Sign in fail! Error message: ', error.message)
    });
}


