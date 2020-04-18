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

export function getNearbyPosts(currentLat, currentLong, range) {
    let postList = [];
    let postsRef = db.collectin('post');
    let query = postsRef.where('lat', '<=', (currentLat+range)).where('lat', '>=', (currentLat-range));
    query.get().then(function(posts) {
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
