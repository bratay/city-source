import * as firebase from 'firebase';
import { db } from './index.js';

export var googleUserObj

export var currentUserObj = {
    bio: "",
    hometown: "",
    picUrl: "",
    userID: 0,
    username: "",
    userType: 0
}

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
        // Creates new document with token as name of doc
        db.collection('users').doc(userToken).set({
            bio: "",
            hometown: "",
            picUrl: googleUserObj.picUrl,
            userID: userToken,
            username: googleUserObj.displayName,
            userType: 0
        })
        
        updateCurrentUser(db.collection('user').doc(userToken))

        return 0
    } else {
        updateCurrentUser(db.collection('user').doc(userToken))

        return 1
    }
}

function updateCurrentUser(userDoc){
    currentUserObj = {
        bio: userDoc.bio,
        hometown: userDoc.hometown,
        picUrl: userDoc.picUrl,
        userID: userDoc.userID,
        username: userDoc.username,
        userType: userDoc.userType
    }
}

export function saveHometown(hometown) {
    db.collection('users').doc(googleUserObj.credential.accessToken).update({
        hometown: hometown
    }).catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        return false
    });
    return true
}

// example of ID check func
export function getUser(token) {
    //probably some firebase calls
    return true
}
