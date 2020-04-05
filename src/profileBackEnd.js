import * as firebase from 'firebase';
import { db } from './index.js';
import { currentUserObj } from './signIn.js';

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
                hometownCoor: [0, 0],
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

export function getUserPost(userKey) {
    let listOfPost = [];
    let queryResult = db.collection('post').where('userID', '==', userKey)

    queryResult.get().then(queriedDocs => {
        if (queriedDocs.empty == false) {
            queriedDocs.forEach(singleDoc => {
                let currentPost = {
                    comments: singleDoc.data().comments,
                    devPost: singleDoc.data().devPost,
                    pic: singleDoc.data().pic,
                    postID: singleDoc.data().postID,
                    likes: singleDoc.likes,
                    dislikes: singleDoc.dislikes,
                    timestamp: singleDoc.data().timestamp, //convert from epoch to normal time date
                    title: singleDoc.data().title,
                    userID: singleDoc.data().userID
                }

                listOfPost.push(currentPost)
            })
        } else {
            console.log("This user doesn't have any post");
        }
    });

    return listOfPost
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
export function getBio(google_id){
  const collect = db.collection('TestCollection')//get wanted collection
  var query = collect.where('user_id', '==', google_id)
  query.get().then(queriedDocs => {
      if (queriedDocs.empty == false) {
          queriedDocs.forEach(singleDoc => {
              return singleDoc.data().bio;
          })
      } else {
          console.log("No docs match");
      }
  });
}

export function setBio(newBioString){
  var user = firebase.auth().currentUser;
  db.collection('users').doc(user.credential.accessToken).update({
      bio: newBioString
  }).catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
      return false
  });
  return true
}

export function getHometown(google_id){
  const collect = db.collection('TestCollection')//get wanted collection
  var query = collect.where('user_id', '==', google_id)
  query.get().then(queriedDocs => {
      if (queriedDocs.empty == false) {
          queriedDocs.forEach(singleDoc => {
              return singleDoc.data().hometown;
          })
      } else {
          console.log("No docs match");
      }
  });
}

export function setHometown(newHometown){
  var user = firebase.auth().currentUser;
  db.collection('users').doc(user.credential.accessToken).update({
      hometown: newHometown
  }).catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
      return false
  });
  return true
}

export function getUserPic(google_id){
  const collect = db.collection('TestCollection')//get wanted collection
  var query = collect.where('user_id', '==', google_id)
  query.get().then(queriedDocs => {
      if (queriedDocs.empty == false) {
          queriedDocs.forEach(singleDoc => {
              return singleDoc.data().picURL;
          })
      } else {
          console.log("No docs match");
      }
  });
}

export function setUserPic(newPicURI){
  var user = firebase.auth().currentUser;
  db.collection('users').doc(user.credential.accessToken).update({
      picUrl: newPicURI
  }).catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
      return false
  });
  return true
}
export function getUserId(google_id){
  const collect = db.collection('TestCollection')//get wanted collection
  var query = collect.where('user_id', '==', google_id)
  query.get().then(queriedDocs => {
      if (queriedDocs.empty == false) {
          queriedDocs.forEach(singleDoc => {
              return singleDoc.data().userID;
          })
      } else {
          console.log("No docs match");
      }
  });
}
export function setUserId(newUserID){
  var user = firebase.auth().currentUser;
  db.collection('users').doc(user.credential.accessToken).update({
      userID: newUserID
  }).catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
      return false
  });
  return true
}
export function getUsername(google_id){
  const collect = db.collection('users')//get wanted collection
  var query = collect.where('user_id', '==', google_id)
  query.get().then(queriedDocs => {
      if (queriedDocs.empty == false) {
          queriedDocs.forEach(singleDoc => {
              return singleDoc.data().username;
          })
      } else {
          console.log("No docs match");
      }
  });
}
export function setUsername(newUserName){
  var user = firebase.auth().currentUser;
  db.collection('users').doc(user.credential.accessToken).update({
      username: newUserName
  }).catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
      return false
  });
  return true
}
