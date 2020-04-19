import * as firebase from 'firebase';
import { db } from './index.js';
import { currentUserObj, googleSignIn } from './signIn.js';

export function createpost(postObject) {
    let postID = db.collection('post').doc().id; //Generate a new ID
    let newpost = {}
    let timestamp = Date.now()

    newpost = {
        address: postObject.address,
        devpost: currentUserObj.userType,
        dislikes: [],
        lat: postObject.lat,
        likes: [],
        long: postObject.long,
        pic: null,
        postID: postID,
        text: postObject.text,
        timestamp: timestamp,
        title: postObject.title,
        userID: currentUserObj.userID,
        username: currentUserObj.username,
    }

    db.collection('post').doc(postID).set({
        address: postObject.address,
        devpost: currentUserObj.userType,
        dislikes: [],
        lat: postObject.lat,
        likes: [],
        long: postObject.long,
        pic: null,
        postID: postID,
        text: postObject.text,
        timestamp: timestamp,
        title: postObject.title,
        userID: currentUserObj.userID,
        username: currentUserObj.username,
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
                bio: newPostInfo.bio,
                address: newPostInfo.address,
                lat: newPostInfo.lat,
                long: newPostInfo.long,
                pic: newPostInfo.pic,
                text: newPostInfo.text,
                timestamp: newTimestamp,
                title: newPostInfo.title,
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
    let postList = [];
    let postsRef = db.collection('post');
    let query = postsRef.where('lat', '<=', (currentLat+range)).where('lat', '>=', (currentLat-range));
    await query.get().then(function(posts) {
      posts.forEach(function(post) {
        let postObject = post.data();
        if(postObject.long >= (currentLong - range) && postObject.long <= currentLong + range) {
          postList.push(postObject);
        }
      });
    });
    return postList;
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
  await commentList.get().then(function(comments){
    var batch = db.batch();
    comments.forEach(function(com){
      batch.delete(com.ref);
    });
    return batch.commit();
  }).then(function(){
    return true;
  });
}

export async function getLikeCount(post_id) {
    const collect = db.collection('post')//get wanted collection
    var query = collect.where('post_id', '==', post_id)
    await query.get().then(queriedDocs => {
        if (queriedDocs.empty === false) {
            queriedDocs.forEach(singleDoc => {
                var likeArray = singleDoc.data().likes;
                return likeArray.length;
            })
        } else {
            console.log("No docs match");
            return -1;
        }
    });
}

export async function getDislikeCount(post_id) {
    const collect = db.collection('post')//get wanted collection
    var query = collect.where('post_id', '==', post_id)
    await query.get().then(queriedDocs => {
        if (queriedDocs.empty === false) {
            queriedDocs.forEach(singleDoc => {
                var likeArray = singleDoc.data().dislikes;
                return likeArray.length;
            })
        } else {
            console.log("No docs match");
            return -1;
        }
    });
}

export async function getUserInLikes(post_id, user_id) {
    const collect = db.collection('post')//get wanted collection
    var query = collect.where('postID', '==', post_id).where('likes', 'array-contains', user_id);
    await query.get().then(queriedDocs => {
        if (queriedDocs.empty === false) {
            return true;
        } else {
            return false;
        }
    });
}

export async function getUserInDislikes(post_id, user_id) {
    const collect = db.collection('post')//get wanted collection
    var query = collect.where('postID', '==', post_id).where('dislikes', 'array-contains', user_id);
    await query.get().then(queriedDocs => {
        if (queriedDocs.empty === false) {
            return true;
        } else {
            return false;
        }
    });
}
