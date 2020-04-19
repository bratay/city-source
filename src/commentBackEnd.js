import * as firebase from 'firebase';
import { currentUserObj } from './signIn.js';
import { db } from './index.js';

//Returns a list of comments obj in chronological order with a local or non-local flag
export async function getCommentsFromPost(postID) {
    var commentsObjList = []
    var postComments = db.collection('comments').where('postID', '==', postID)

    await postComments.get().then(allCommments => {
        allCommments.forEach(comment => {
            comment = createCommentObj(comment)
            commentsObjList.push(comment)
        })
    })

    //sort list in chronological order
    commentsObjList.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1)

    return commentsObjList
}

function createCommentObj(commentDoc) {
    let commentObj = {}

    commentObj = {
        comment: commentDoc.data().comment,
        userID: commentDoc.data().userID,
        userName: commentDoc.data().useName,
        postID: commentDoc.data().postID,
        commentID: commentDoc.data().commentID,
        likes: commentDoc.data().likes,
        dislikes: commentDoc.data().dislikes,
        reported: commentDoc.data().reported,
        timestamp: commentDoc.data().timestamp,
        local: commentDoc.data().local
    }

    return commentObj
}

export async function createComment(commentString, postID) {
    if (currentUserObj.userID == "")
    return false;

    let commentID = db.collection('comments').doc().id; //Generate a new ID
    let isLocalComment = await isLocal(postID)
    let newComment = {}
    let timestamp = Date.now()

    newComment = {
        comment: commentString,
        userID: currentUserObj.userID,
        userName: currentUserObj.username,
        postID: postID,
        commentID: commentID,
        likes: [],
        dislikes: [],
        reported: false,
        timestamp: timestamp,
        local: isLocalComment
    }

    db.collection('comments').doc(commentID).set({
        comment: commentString,
        userID: currentUserObj.userID,
        userName: currentUserObj.username,
        postID: postID,
        commentID: commentID,
        likes: [],
        dislikes: [],
        reported: false,
        timestamp: timestamp,
        local: isLocalComment
    })

    // Update post doc with new comment ID
    db.collection('post').doc(postID).update({
        comments: firebase.firestore.FieldValue.arrayUnion(
            commentID
            )
        }).catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating post document: ", error)
            return false
        });

        return newComment
    }

//returns true if commenter is considered a local to the location of the post
// +- .13 lat long
async function isLocal(postID) {
    let local = await db.collection("post").doc(postID).get().then(async doc => {
        let data = await doc.data()
        let postLat = data.lat
        let postLong = data.long

        if (currentUserObj.lat < postLat + .13 && currentUserObj.lat > postLat - .13 &&
            currentUserObj.long < postLong + .13 && currentUserObj.long > postLong - .13) {
            return true
        } else {
            return false
        }
    })
    return local
}

export async function likeComment(commentID) {
    if (currentUserObj.userID == "")
        return false;

    const collect = db.collection('comments').where('commentID', '==', commentID)
    let result = await collect.get().then(async q => {
        let suc
        await q.forEach(queriedDocs => {
            if (queriedDocs.empty)
                suc = false;

            let likesList = queriedDocs.data().likes;
            let dislikesList = queriedDocs.data().dislikes;

            if (likesList.includes(currentUserObj.userID) == true) {
                suc = false;

                //unlike
                db.collection('comments').doc(commentID).update({
                    dislikes: firebase.firestore.FieldValue.arrayRemove(
                        currentUserObj.userID
                    )
                })
            } else {
                db.collection('comments').doc(commentID).update({
                    likes: firebase.firestore.FieldValue.arrayUnion(
                        currentUserObj.userID
                    )
                })

                //remove from dislikes list
                if (dislikesList.includes(currentUserObj.userID) == true) {
                    db.collection('comments').doc(commentID).update({
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

export async function dislikeComment(commentID) {
    if (currentUserObj.userID == "")
        return false;

    const collect = db.collection('comments').where('commentID', '==', commentID)
    let result = await collect.get().then(async q => {
        let suc
        await q.forEach(queriedDocs => {
            if (queriedDocs.empty)
                suc = false;

            let likesList = queriedDocs.data().likes;
            let dislikesList = queriedDocs.data().dislikes;

            if (dislikesList.includes(currentUserObj.userID) == true) {
                suc = false;

                //undislike
                db.collection('comments').doc(commentID).update({
                    likes: firebase.firestore.FieldValue.arrayRemove(
                        currentUserObj.userID
                    )
                })
            } else {
                db.collection('comments').doc(commentID).update({
                    dislikes: firebase.firestore.FieldValue.arrayUnion(
                        currentUserObj.userID
                    )
                })

                //remove from likes list
                if (likesList.includes(currentUserObj.userID) == true) {
                    db.collection('comments').doc(commentID).update({
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

export function setCommentInformation(newCommentInfo, comment_id) {
    var user = firebase.auth().currentUser;
    if (user) {
        if (currentUserObj.userID === user.uid) {
            var newTimestamp = Date.now();
            db.collection('comments').doc(comment_id).update({
                likes: newCommentInfo.likes,
                dislikes: newCommentInfo.dislikes,
                reported: newCommentInfo.reported,
                timestamp: newTimestamp,
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
