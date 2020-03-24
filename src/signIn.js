import * as firebase from 'firebase/app';
import { db } from './index.js';
import { getHometownCoor } from './components/MapUI/Map.js';

export var user;
var userToken;

export var currentUserObj = {
    bio: "",
    hometown: "",
    hometownCoor: [0,0],
    email: "",
    picUrl: "",
    userID: 0,
    username: "",
    userType: 0
}

//returns 1 = user has account, 0 = new user,  -1 = sign in fail
export function googleSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider(); //Google sign in object

    firebase.auth().signInWithRedirect(provider).then(function (result) {
        //Save user object
    }).catch(function (error) {
        console.log('Sign in fail! Error message: ', error.message)
        return -1
    });

    user = firebase.auth().currentUser
    userToken = String(user.uid)  // Use User.getToken() instead. Need to fix this in the future

    if (!userExist(userToken)) {
        // Creates new document with token as name of doc
        db.collection('users').doc(userToken).set({
            bio: "",
            hometown: "",
            hometownCoor: [0, 0], 
            email: user.email,
            picUrl: String(user.photoURL),
            userID: user.uid,
            username: user.displayName,
            userType: 0
        })

        autoUpdateUserObject(db.collection('user').doc(userToken))
        return 0
    } else {
        autoUpdateUserObject(db.collection('user').doc(userToken))
        return 1
    }
}

//signs out current user
export function signOut() {
    firebase.auth().signOut()

    currentUserObj = {
        bio: "",
        hometown: "",
        hometownCoor: [0, 0],
        email: "",
        picUrl: "",
        userID: "",
        username: "",
        userType: 0
    }
}

export function saveHometown(hometown) {
    var homeTownGeoPoint = getHometownCoor(hometown)
    db.collection('users').doc(currentUserObj.userID).update({
        hometown: hometown,
        hometownCoor: homeTownGeoPoint
    }).catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        return false
    });
    return true
}

//Auto updates user Object when doc value is changed via firebase snapshot
//Only called once
function autoUpdateUserObject(currentUser) {
    currentUser.onSnapshot(doc => {
        currentUserObj = {
            bio: doc.bio,
            hometown: doc.hometown,
            hometownCoor: [0, 0],
            email: doc.email,
            picUrl: doc.picUrl,
            userID: doc.userID,
            username: doc.username,
            userType: doc.userType
        }
    });
}

// example of ID check function
export function userExist(token) {
    // return (db.collection('users').doc(token) != null) ? true : false
    return false;
}
