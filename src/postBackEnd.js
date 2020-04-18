import * as firebase from 'firebase';
import { db } from './index.js';
import { currentUserObj, googleSignIn } from './signIn.js';

export function createpost(postObject) {
    let postID = db.collection('post').doc().id; //Generate a new ID
    let newpost = {}
    let timestamp = Date.now()

    newpost = {
        title: postObject.title,
        address: postObject.address,
        lat: postObject.lat,
        long: postObject.long,
        devpost: currentUserObj.userType,
        dislikes: [],
        likes: [],
        postID: postID,
        userID: currentUserObj.userID,
        username: currentUserObj.username,
        text: postObject.text,
        title: postObject.title,
        timestamp: timestamp
    }

    db.collection('post').doc(postID).set({
        title: postObject.title,
        address: postObject.address,
        lat: postObject.lat,
        long: postObject.long,
        devpost: currentUserObj.userType,
        dislikes: [],
        likes: [],
        postID: postID,
        username: currentUserObj.username,
        userID: currentUserObj.userID,
        text: postObject.text,
        title: postObject.title,
        timestamp: timestamp
    })

    return newpost
}

///////////////////////////////////////////////////////
//Post gets and sets
///////////////////////////////////////////////////////

export function setPostInformation(newPostInfo, post_id) {
    var user = firebase.auth().currentUser;
    if (user) {
        if (currentUserObj.userID === user.uid) {
            var newTimestamp = Date.now()
            db.collection('post').doc(post_id).update({
                title: newPostInfo.title,
                address: newPostInfo.address,
                lat: newPostInfo.lat,
                long: newPostInfo.long,
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

export async function getNearbyPosts(currentLat, currentLong, range) {
    let postsRef = db.collectin('post');
    let query = postsRef.where('lat', '<=', (currentLat+range)).where('lat', '>=', (currentLat-range));
    let result = await query.get().then(async posts => {
      let postList = [];
      await posts.forEach(function(post) {
        let postObject = {
            comments: post.data().comments,
            devPost: post.data().devPost,
            dislikes: post.dislikes,
            likes: post.likes,
            pic: post.data().pic,
            postID: post.data().postID,
            text: post.data().text,
            timestamp: post.data().timestamp, //convert from epoch to normal time date
            title: post.data().title,
            userID: post.data().userID,
        };
        if(postObject.long >= (currentLong - range) && postObject.long <= currentLong + range) {
          postList.push(postObject);
        }
      });
      return postList;
    });
    return result;
}

export async function likePost(postID) {
    if (currentUserObj.userID == "")
        return false;

    const collect = db.collection('post').where('postID', '==', postID)
    let result = await collect.get().then(async q => {
        let suc
        await q.forEach(queriedDocs => {
            if (queriedDocs.empty)
                suc = false;

            let likesList = queriedDocs.data().likes;
            let dislikesList = queriedDocs.data().dislikes;

            if (likesList.includes(currentUserObj.userID) == true) {
                suc = false;

                //remove from likes list
                db.collection('post').doc(postID).update({
                    likes: firebase.firestore.FieldValue.arrayRemove(
                        currentUserObj.userID
                    )
                })
            } else {
                db.collection('post').doc(postID).update({
                    likes: firebase.firestore.FieldValue.arrayUnion(
                        currentUserObj.userID
                    )
                })

                //remove from dislikes list
                if (dislikesList.includes(currentUserObj.userID) == true) {
                    db.collection('post').doc(postID).update({
                        dislikes: firebase.firestore.FieldValue.arrayRemove(
                            currentUserObj.userID
                        )
                    })
                }

                suc = true
            }
        })

        return suc
    });

    return result
}

export async function dislikePost(postID) {
    if (currentUserObj.userID == "")
        return false;

    const collect = db.collection('post').where('postID', '==', postID)
    let result = await collect.get().then(async q => {
        let suc
        await q.forEach(queriedDocs => {
            if (queriedDocs.empty)
                suc = false;

            let likesList = queriedDocs.data().likes;
            let dislikesList = queriedDocs.data().dislikes;

            if (dislikesList.includes(currentUserObj.userID) == true) {
                suc = false;

                //Remove from dislike list
                db.collection('post').doc(postID).update({
                    dislikes: firebase.firestore.FieldValue.arrayRemove(
                        currentUserObj.userID
                    )
                })
            } else {
                db.collection('post').doc(postID).update({
                    dislikes: firebase.firestore.FieldValue.arrayUnion(
                        currentUserObj.userID
                    )
                })

                //remove from likes list
                if (likesList.includes(currentUserObj.userID) == true) {
                    db.collection('post').doc(postID).update({
                        likes: firebase.firestore.FieldValue.arrayRemove(
                            currentUserObj.userID
                        )
                    })
                }

                suc = true
            }
        })

        return suc
    });

    return result
}

export async function deletePost(postID){
  if (currentUserObj.userID == "")
    return false;
  db.collection('post').doc(postID).delete();
  let commentList = db.collection('comments').where('postID', '==', postID);
  commentList.get().then(function(comments){
    var batch = db.batch();
    comments.forEach(function(com){
      batch.delete(com.ref);
    });
    return batch.commit();
  }).then(function(){
    return true;
  });
}

export function getLikeCount(post_id) {
    const collect = db.collection('post')//get wanted collection
    var query = collect.where('post_id', '==', post_id)
    query.get().then(queriedDocs => {
        if (queriedDocs.empty === false) {
            queriedDocs.forEach(singleDoc => {
                var likeArray = singleDoc.data().likes;
                return likeArray.length();
            })
        } else {
            console.log("No docs match");
        }
    });
}

export function getDislikeCount(post_id) {
    const collect = db.collection('post')//get wanted collection
    var query = collect.where('post_id', '==', post_id)
    query.get().then(queriedDocs => {
        if (queriedDocs.empty === false) {
            queriedDocs.forEach(singleDoc => {
                var likeArray = singleDoc.data().dislikes;
                return likeArray.length();
            })
        } else {
            console.log("No docs match");
        }
    });
}

export function getUserInLikes(post_id, user_id) {
    const collect = db.collection('post')//get wanted collection
    var query = collect.where('postID', '==', post_id).where('likes', 'array-contains', user_id);
    query.get().then(queriedDocs => {
        if (queriedDocs.empty === false) {
            return true;
        } else {
            return false;
        }
    });
}

export function getUserInDislikes(post_id, user_id) {
    const collect = db.collection('post')//get wanted collection
    var query = collect.where('postID', '==', post_id).where('dislikes', 'array-contains', user_id);
    query.get().then(queriedDocs => {
        if (queriedDocs.empty === false) {
            return true;
        } else {
            return false;
        }
    });
}
