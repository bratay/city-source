import * as firebase from 'firebase';
import { db } from './index.js';
import { currentUserObj } from './signIn.js';

export function createpost(postObject) {
    let postID = db.collection('post').doc().id; //Generate a new ID
    let isLocalpost = true //Create way to see if current user lives in city that post is in
    let newpost = {}
    let timestamp = Date.now()

    newpost = {
        title: postObject.title,
        address: postObject.address,
        coor: postObject.coor,
        devpost: postObject.devpost,
        dislikes: 0,
        likes: 0,
        postID: postID,
        userID: currentUserObj.userID,
        text: postObject.text,
        timestamp: timestamp
    }

    db.collection('post').doc(postID).set({
        title: postObject.title,
        address: postObject.address,
        coor: postObject.coor,
        devpost: postObject.devpost,
        dislikes: 0,
        likes: 0,
        postID: postID,
        userID: currentUserObj.userID,
        text: postObject.text,
        timestamp: timestamp

        // reported: false,
        // local: isLocalpost
    })

    return newpost
}

///////////////////////////////////////////////////////
//Post gets and sets
///////////////////////////////////////////////////////

export function setPostInformation(newPostInfo, post_id) {
  var user = firebaase.auth().currentUser;
  if(user){
    if(currentUserObj.userID === user.uid){
      var newTimestamp = Date.now()
      db.collection('post').doc(post_id).update({
        title: newPostInfo.title,
        address: newPostInfo.address,
        coor: newPostInfo.coor,
        text: newPostInfo.text,
        timestamp: newTimestamp
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
