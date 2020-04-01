import * as firebase from 'firebase';
import { db } from './index.js';
import { currentUserObj, userExist } from './signIn.js';

//Call a functions that's not asyc then call getUserProfileOnj from there

export async function getUserProfileObj(userKey) {
    if (userKey === currentUserObj.userID)
        return currentUserObj

    //We aren't using this right now
    //Need to fix userExist function first
    // else if (userExist(userKey))
    //     return false

    let rawUser = db.collection('users').doc(userKey)

    let userObj = {
        bio: "",
        email: "",
        hometown: "",
        hometownCoor: [0, 0],
        picUrl: "",
        userID: "",
        username: "",
        userType: 0
    }

    await rawUser.get().then(function (doc) {
        if (!doc.exists) {
            // doc.data() will be undefined in this case
            console.log("No such document");
        } else {
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
        if (queriedDocs.empty === false) {
            queriedDocs.forEach(singleDoc => {
                let currentPost = {
                    comments: singleDoc.data().comments,
                    devPost: singleDoc.data().devPost,
                    pic: singleDoc.data().pic,
                    postID: singleDoc.data().postID,
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
//Post gets and sets
///////////////////////////////////////////////////////
export function getBio(google_id){
  const collect = db.collection('TestCollection')//get wanted collection
  query = collect.where('user_id', '==', google_id)
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
  query = collect.where('user_id', '==', google_id)
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
  query = collect.where('user_id', '==', google_id)
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
  query = collect.where('user_id', '==', google_id)
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
  query = collect.where('user_id', '==', google_id)
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
  db.collection('users').doc(user.credential.accessToken).update({
      username: newUserName
  }).catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
      return false
  });
  return true
}
