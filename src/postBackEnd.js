import * as firebase from 'firebase';
import { db } from './index.js';
import { currentUserObj, userExist } from './signIn.js';


///////////////////////////////////////////////////////
//Post gets and sets
///////////////////////////////////////////////////////

export function getAddress(post_id){
  const collect = db.collection('post')//get wanted collection
  query = collect.where('post_id', '==', post_id)
  query.get().then(queriedDocs => {
      if (queriedDocs.empty == false) {
          queriedDocs.forEach(singleDoc => {
              return singleDoc.data().address;
          })
      } else {
          console.log("No docs match");
      }
  });
}

export function setAddress(post_id, newAddress){
  db.collection('post').doc(post_doc).update({
      addres: newAddress
  }).catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
      return false
  });
  return true
}

// Thinking it might be better to simply do one search for every comment
// item with a given post_id than a serach for a specific comment id for
// every value in an array of comments.  Will talk with Branden about this

// export function getComments(post_id){
//   const collect = db.collection('post')//get wanted collection
//   query = collect.where('post_id', '==', post_id)
//   query.get().then(queriedDocs => {
//       if (queriedDocs.empty == false) {
//           queriedDocs.forEach(singleDoc => {
//               return singleDoc.data().comments;
//           })
//       } else {
//           console.log("No docs match");
//       }
//   });
// }
//
// export function setComments(post_doc, newComment){
//   db.collection('post').doc(post_doc).update({
//       hometown: newHometown
//   }).catch(function (error) {
//       // The document probably doesn't exist.
//       console.error("Error updating document: ", error);
//       return false
//   });
//   return true
// }


// Not in database currently, needs to be added
// export function getUserPic(post_id){
//   const collect = db.collection('post')//get wanted collection
//   query = collect.where('post_id', '==', post_id)
//   query.get().then(queriedDocs => {
//       if (queriedDocs.empty == false) {
//           queriedDocs.forEach(singleDoc => {
//               return singleDoc.data().pictures;
//           })
//       } else {
//           console.log("No docs match");
//       }
//   });
// }
//
// export function setUserPic(post_doc, newPicLoc){
//   db.collection('post').doc(post_doc).update({
//       pictures: newPicLoc
//   }).catch(function (error) {
//       // The document probably doesn't exist.
//       console.error("Error updating document: ", error);
//       return false
//   });
//   return true
// }

export function setPostID(post_doc, newPostID){
  db.collection('post').doc(post_doc).update({
      postID: newPostID
  }).catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
      return false
  });
  return true
}

export function getTimeStamp(post_id){
  const collect = db.collection('post')//get wanted collection
  query = collect.where('post_id', '==', post_id)
  query.get().then(queriedDocs => {
      if (queriedDocs.empty == false) {
          queriedDocs.forEach(singleDoc => {
              return singleDoc.data().timestamp;
          })
      } else {
          console.log("No docs match");
      }
  });
}
export function setTimeStamp(post_doc, newTimeStamp){
  db.collection('post').doc(post_doc).update({
      timestamp: newTimeStamp
  }).catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
      return false
  });
  return true
}

export function getTitle(post_id){
  const collect = db.collection('post')//get wanted collection
  query = collect.where('post_id', '==', post_id)
  query.get().then(queriedDocs => {
      if (queriedDocs.empty == false) {
          queriedDocs.forEach(singleDoc => {
              return singleDoc.data().title;
          })
      } else {
          console.log("No docs match");
      }
  });
}
export function setTitle(post_doc, newTitle){
  db.collection('post').doc(post_doc).update({
      title: newTitle
  }).catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
      return false
  });
  return true
}


export function getUserId(post_id){
  const collect = db.collection('post')//get wanted collection
  query = collect.where('post_id', '==', post_id)
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
export function setUserId(post_doc, newUserID){
  db.collection('post').doc(post_doc).update({
      userID: newUserID
  }).catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
      return false
  });
  return true
}
