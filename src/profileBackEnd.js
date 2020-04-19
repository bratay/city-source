import * as firebase from 'firebase';
import { db } from './index.js';
import { currentUserObj } from './signIn.js';
import { deletePost } from './postBackEnd.js';

export async function getUserProfileObj(userKey) {
    let userExist, userObj
    let query = db.collection('users').where('userID', '==', userKey)
    await query.get().then(doc => { userExist = (doc.empty) ? false : true })

    if (userKey === currentUserObj.userID)
        return currentUserObj
    else if (!userExist)
        return false

    console.log("Not the currrent user")
    let rawUser = db.collection('users').doc(userKey)

    await rawUser.get().then(function (doc) {
        if (doc.exists) {
            userObj = {
                bio: doc.data().bio,
                hometown: doc.data().hometown,
                hometownLat: doc.data().hometownLat,
                hometownLong: doc.data().hometownLong,
                email: doc.data().email,
                picUrl: doc.data().picUrl,
                userID: doc.data().userID,
                username: doc.data().username,
                userType: doc.data().userType
            }
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });

    return userObj
}

export async function getUserPost(userKey) {
    let listOfPost = [];
    let queryResult = db.collection('post').where('userID', '==', userKey)

    await queryResult.get().then(queriedDocs => {
        if (queriedDocs.empty === false) {
            queriedDocs.forEach(singleDoc => {
                let currentPost = {
                    comments: singleDoc.data().comments,
                    devPost: singleDoc.data().devPost,
                    dislikes: singleDoc.dislikes,
                    likes: singleDoc.likes,
                    pic: singleDoc.data().pic,
                    postID: singleDoc.data().postID,
                    text: singleDoc.data().text,
                    timestamp: singleDoc.data().timestamp, //convert from epoch to normal time date
                    title: singleDoc.data().title,
                    userID: singleDoc.data().userID,
                };
                listOfPost.push(currentPost);
            });
        } else {
            console.log("This user doesn't have any post");
        }
    });

    return listOfPost;
}

//convert epoch time (number of seconds from 1/1/1970) to
//month day year hours:minutes:seconds
export function getTimeDate(epochSeconds) {
    var rawDate = new Date(epochSeconds * 1000).toString()

    var formattedDate = rawDate.slice(4, 10) // date
    formattedDate += " " + rawDate.slice(11, 24) //time

    return formattedDate
}

///////////////////////////////////////////////////////
//Profile gets and sets
///////////////////////////////////////////////////////

export function setUserInformation(newUserInfo) {
  var user = firebase.auth().currentUser;
  if(user){
    if(currentUserObj.userID === user.uid){
      var timestamp = Date.now()
      db.collection('users').doc(user.uid).update({
        bio: newUserInfo.bio,
        hometown: newUserInfo.hometown,
        hometownLat: newUserInfo.hometownLat,
        hometownLong: newUserInfo.hometownLong,
        email: newUserInfo.email,
        picUrl: newUserInfo.picUrl,
        username: newUserInfo.username,
        userType: newUserInfo.userType
      });
      return true;
    }
    else {
      console.log("You shouldn't be here... you're the wrong user");
      return false;
    }
  }
  else {
    console.log("There's a problem, you aren't logged in!");
    return false;
  }
}

export async function deleteUser(userID){
  if (currentUserObj.userID == "")
    return false;
  db.collection('users').doc(userID).delete();
  let postList = db.collection('posts').where('userID', '==', userID);
  await postList.get().then(function(posts){
    var batch = db.batch();
    posts.forEach(function(post){
      deletePost(post.postID);
    });
  }).then(function(){
    return true;
  });
}
