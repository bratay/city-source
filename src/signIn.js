import * as firebase from 'firebase';
import { db } from './index.js';


export var googleUserObj
// const db = firebase.firestore() //Firestore noSQL database object

//returns 1 = user has account, 0 = new user,  -1 = sign in fail
export function googleSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider(); //Google sign in object
    var userToken;

    firebase.auth().signInWithPopup(provider).then(function (result) {
        // save Google user object
        googleUserObj = result
        userToken = googleUserObj.credential.accessToken
    }).catch(function (error) {
        console.log('Sign in fail! Error message: ', error.message)
        return -1
    });

    if (!tempDoesUserExist(userToken)) {
        db.collection('users').add({
            bio: "",
            hometown: "",
            picUrl: googleUserObj.picUrl,
            userID: userToken,
            postID: 0,
            username: googleUserObj.displayName
        })

        return 0
    }else{
        return 1
    }
}

export function saveHometown(hometown){
    db.collection('users').doc(googleUserObj.credential.accessToken).update({
        hometown: hometown
    }).catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        return false
    });
    return true
}

// example of ID check func
function tempDoesUserExist(token) {
    //probably some firebase calls
    return true
}
