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
//SADR9OBQMxQzKJIUFF3VGcDg02A2   branden - out dated
export async function testGetProfileObject() {
    console.log("Start")
    let use = await getUserProfileObj("SADR9OBQMxQzKJIUFF3VGcDg02A2")
    console.log("Exit get function")
    console.log(String(use.username))
    console.log(use.userID)
    console.log(use.email)
    console.log("Finish")
}

export async function testGetProfile(){
    await googleSignIn()
    let id = "1234567"
    let result = await getUserProfileObj(id)
    console.log(result)
    id = "9XfAFzqmqyVUeUL1X6RbuRHIqAh1" // - jake This could be out dated
    result = await getUserProfileObj(id)
    console.log(result)
    id = "UBj7oew8LgaMJfQ39J0nrufomWU2" // - BRanden This could be out dated
    result = await getUserProfileObj(id)
    console.log(result)
}

export function createCommentTest() {
    var newComment = "This is a new comment"
    var postID = "123456"

    var obj = createComment(newComment, postID)

    console.log(obj)
}

export async function testGetComments(){
    var postID = "123456"

    var commentList = await getCommentsFromPost(postID)
    console.log(commentList)
}

export function testDisFromCurUser(){
    let result = getDisFromCurUser(3, 7)
    console.log(currentUserObj.hometownCoor)
    console.log(result)
}

export async function testCreatePost(){
    let post ={
        address: "2327 N 81st Court",
        coor: [3, 5],
        devpost: false,
        text: "This is a test of post creation",
    }
    let result = createpost(post)
    console.log("Local post - " + result.text)

    await db.collection("post").doc(result.postID).get().then(doc =>{
        console.log("DB post - " + doc.data().text)
    })
}

export async function testpostLike() {
    let success = await likePost("Temp post ID")
    console.log("Likes success - " + success)
}

export async function testpostDislike() {
    let success = await dislikePost("Temp post ID")
    console.log("Dislikes success - " + success)
}