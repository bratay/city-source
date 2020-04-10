import * as firebase from 'firebase/app';
import { db } from './index.js';

export var user;

export var currentUserObj = {
    bio: "",
    hometown: "",
    hometownLat: 0,
    hometownLong: 0,
    email: "",
    picUrl: "",
    userID: "",
    username: "",
    userType: 0
}

//returns 1 = user has account, 0 = new user,  -1 = sign in fail
export async function googleSignIn() {
    let result = await realGoogleSignIn();
    return result;
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
                    hometownLat: 0,
                    hometownLong: 0,
                    email: user.email,
                    picUrl: String(user.photoURL),
                    userID: user.uid,
                    username: user.displayName,
                    userType: 0
                })

                await autoUpdateUserObject(db.collection('users').doc(user.uid));
                result = 0;
            } else {
                await autoUpdateUserObject(db.collection('users').doc(user.uid));
                result = 1;
            }
        }
    );

    return result
}

// If there's already an account in the cache, update the currentUserObj
// I don't know if this even does anything useful
export async function cachedSignIn() {
    let user = firebase.auth().currentUser;
    if (user !== null) {
        await autoUpdateUserObject(db.collection('users').doc(user.uid));
        return true;
    }
    return false;
}

//signs out current user
export function signOut() {
    firebase.auth().signOut();

    currentUserObj.bio = "";
    currentUserObj.hometown = "";
    currentUserObj.hometownLat = 0;
    currentUserObj.hometownLong = 0;
    currentUserObj.email = "";
    currentUserObj.picUrl = "";
    currentUserObj.userID = "";
    currentUserObj.username = "";
    currentUserObj.userType = 0;
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

    currentUserObj.bio = userData.data().bio;
    currentUserObj.hometown = userData.data().hometown;
    currentUserObj.hometownLat = userData.data().hometownLat;
    currentUserObj.hometownLong = userData.data().hometownLong;
    currentUserObj.email = userData.data().email;
    currentUserObj.picUrl = userData.data().picUrl;
    currentUserObj.userID = userData.data().userID;
    currentUserObj.username = userData.data().username;
    currentUserObj.userType = userData.data().userType;
    
    doc.onSnapshot(userDoc => {
        currentUserObj.bio = userDoc.data().bio;
        currentUserObj.hometown = userDoc.data().hometown;
        currentUserObj.hometownLat = userDoc.data().hometownLat;
        currentUserObj.hometownLong = userDoc.data().hometownLong;
        currentUserObj.email = userDoc.data().email;
        currentUserObj.picUrl = userDoc.data().picUrl;
        currentUserObj.userID = userDoc.data().userID;
        currentUserObj.username = userDoc.data().username;
        currentUserObj.userType = userDoc.data().userType;
    });
}
