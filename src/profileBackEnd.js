import * as firebase from 'firebase';
import { db } from './index.js';
import { currentUserObj } from './signIn.js';

export function getUserProfileObj(userKey) {
    if (!userExist())
        return false

    let rawUser = db.collection('user').doc(userKey)

    let userObj = {
        bio: "",
        hometown: "",
        picUrl: "",
        userID: 0,
        username: "",
        userType: 0
    }

    rawUser.get().then(function (doc) {
        if (!doc.exists) {
            // doc.data() will be undefined in this case
            console.log("No such document");
        } else {
            console.log("Document data for test:", doc.data());

            userObj = {
                bio: doc.bio,
                hometown: doc.hometown,
                picUrl: doc.picUrl,
                userID: doc.userID,
                username: doc.username,
                userType: doc.userType
            }
        }

    }).catch(function (error) {
        console.log("Error getting document:", error);
    });

    return userObj
}

export function getUserPost(userKey) {
    let listOfPost = [];
    let queryResult = db.collection('post').where('userID', '==', userKey)

    queryResult.get().then(queriedDocs => {
        if (queriedDocs.empty == false) {
            queriedDocs.forEach(singleDoc => {

                let currentPost = {
                    comments: singleDoc.comments,
                    devPost: singleDoc.devPost,
                    pic: singleDoc.pic,
                    postID: singleDoc.postID,
                    timestamp: singleDoc.timestamp, //how are we doing time 
                    title: singleDoc.title,
                    userID: singleDoc.userID
                }

                listOfPost.push(currentPost)
            })
        } else {
            console.log("This user doesn't have any post");
        }
    });

    return listOfPost
}

//Temp user Exist 
//this will be in singIn.js
function userExist() { return true }
