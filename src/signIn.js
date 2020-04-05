import * as firebase from 'firebase/app';
import { db } from './index.js';

export var user;

export var currentUserObj = {
    bio: "",
    hometown: "",
    hometownCoor: [0, 0],
    email: "",
    picUrl: "",
    userID: 0,
    username: "",
    userType: 0
}

//returns 1 = user has account, 0 = new user,  -1 = sign in fail
export async function googleSignIn() {
    let result = await realGoogleSignIn()
    return result
}

export async function realGoogleSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider(); //Google sign in object
    let result = null

    await firebase.auth().signInWithPopup(provider).then(
        async function (r) {
            let user = firebase.auth().currentUser
            let newUser = false

            let query = db.collection('users').where('userID', '==', user.uid)
            await query.get().then(doc => { newUser = (doc.empty) ? true : false })

            if (newUser) {
                // Creates new document with token as name of doc
                db.collection('users').doc(user.uid).set({
                    bio: "",
                    hometown: "",
                    hometownCoor: [0, 0],
                    email: user.email,
                    picUrl: String(user.photoURL),
                    userID: user.uid,
                    username: user.displayName,
                    userType: 0
                })

                autoUpdateUserObject(db.collection('users').doc(user.uid))
                result = 0
            } else {
                autoUpdateUserObject(db.collection('users').doc(user.uid))
                result = 1
            }
        }
    )

    return result
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

export function saveHometown(hometownStr, lat, long) {
    var homeTownGeoPoint = new firebase.firestore.GeoPoint(lat, long)
    db.collection('users').doc(currentUserObj.userID).update({
        hometown: hometownStr,
        hometownCoor: homeTownGeoPoint
    }).catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        return false
    });
    return true
}

//Auto updates user Object when doc value is changed via firebase snapshot only called once
async function autoUpdateUserObject(doc) {
    let userData = await doc.get()

    currentUserObj = {
        bio: userData.data().bio,
        hometown: userData.data().hometown,
        hometownCoor: [0, 0],
        email: userData.data().email,
        picUrl: userData.data().picUrl,
        userID: userData.data().userID,
        username: userData.data().username,
        userType: userData.data().userType
    }
    
    doc.onSnapshot(userDoc => {
        currentUserObj = {
            bio: userDoc.data().bio,
            hometown: userDoc.data().hometown,
            hometownCoor: userDoc.data().hometownCoor,
            email: userDoc.data().email,
            picUrl: userDoc.data().picUrl,
            userID: userDoc.data().userID,
            username: userDoc.data().username,
            userType: userDoc.data().userType
        }
    });
}
