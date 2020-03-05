import * as firebase from 'firebase';
import { dynamicProfileSearch } from '../src/profileBackEnd'
import { currentUserObj, userExist } from './src/signIn.js';
import { firestore } from 'firebase';
import { Firebase_API_Key } from '../apiKey.js'

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

currentUserObj = {
    bio: "",
    hometown: "The middle of no where",
    hometownCoor: new firebase.firestore.GeoPoint( 100, 100),
    email: "",
    picUrl: "",
    userID: 1234567,
    username: "The Current user",
    userType: 0
}

// var results = dynamicProfileSearch('Branden Taylor')


function testSearch(){
    var input = "Branden Taylor"
    dynamicProfileSearch(input)
}



