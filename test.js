import { Firebase_API_Key } from './apiKey.js';

//Great video 
//https://www.youtube.com/watch?v=9kRgVxULbag&t=1s

///////////////////////////////////////////////////////
//Initialization
///////////////////////////////////////////////////////

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
var app = firebase.initializeApp(firebaseConfig);
// var app = firebase.initializeApp(firebaseConfig, "City Source"); //added name
const analytics = firebase.analytics(); //analytics object
// const db = firebase.database() //Database object 
const db = firebase.firestore() //Firestore noSQL database object 

//Printing info for app, analytics, and database configs
console.log(app, analytics, "\n", db, firestore)


///////////////////////////////////////////////////////
//Read and write
///////////////////////////////////////////////////////

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
    valOne: 'I changed the database',
    valTwo: 7
});


///////////////////////////////////////////////////////
//Query
///////////////////////////////////////////////////////
const collect = db.collection('TestCollection')//get wanted collection
var query = collect.where('valTwo', '>', 5) // name, operator, value

//print out query 
query.get().then(queriedDocs => {
    if (queriedDocs.empty == false) {
        queriedDocs.forEach(singleDoc => {
            console.log('This val is greater than 5: ', singleDoc.data().valTwo)
        })
    } else {
        console.log("No docs match");
    }
});

//docs with valTwo greater than 0 in decending order
query = collect.where('valTwo', '>', 0).orderBy('valTwo', 'desc') // name, operator, value

query.get().then(queriedDocs => {
    if (queriedDocs.empty == false) {
        queriedDocs.forEach(singleDoc => {
            console.log('This val is greater than 0 and descending: ', singleDoc.data().valTwo)
        })
    } else {
        console.log("No docs match");
    }
});

///////////////////
//sign in
//////////////////

// example of ID check use case
/////////////////////////
// int id = 12341
// if (IdExsit(id) == false)
// {
//     //store everything
// }


export async function testDeletePost() {
    let postID = ''//Get a valid post ID
    currentUserObj.userID = "2345"
    let result = await deletePost(postID)

    console.log("Result = " + result)
}

export async function testDeleteUser() {
    let userID = '1234'//Get valid user ID
    currentUserObj.userID = userID
    let result = await deleteCurrentUser()

    let numPost = 0
    let postList = db.collection('posts').where('userID', '==', userID);

    await postList.get().then(posts => {
        posts.forEach(post => {
            numPost++
        })
    })

    console.log("Result = " + result)
    console.log("numPost = " + numPost)
}