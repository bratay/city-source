import * as firebase from 'firebase';
// import { getUserProfileObj } from '../src/profileBackEnd'
import { firestore } from 'firebase';
import { Firebase_API_Key } from '../src/apiKey.js'

// Firebase App configuration
var firebaseConfig = {
	apiKey: Firebase_API_Key,
	authDomain: "city-source-8a88a.firebaseapp.com",
	databaseURL: "https://city-source-8a88a.firebaseio.com",
	projectId: "city-source-8a88a",
	storageBucket: "city-source-8a88a.appspot.com",
	messagingSenderId: "116800112457",
	appId: "1:116800112457:web:e63f46689ea51c11437c98",
	measurementId: "G-D07D7LCMPR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export var db = firebase.firestore()




testGetProfileObject()

//Test ID's
//bWYOnaT0tCdYRhb5JozfLnpGwUk1   Dan
//SADR9OBQMxQzKJIUFF3VGcDg02A2   branden
export async function testGetProfileObject() {
    console.log("Start")
    let use = await getUserProfileObj("SADR9OBQMxQzKJIUFF3VGcDg02A2")
    console.log("Exit get function")
    console.log(String(use.username))
    console.log(use.userID)
    console.log(use.email)
    console.log("Finish")
}
