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
        comment: commentDoc.comment,
        userID: commentDoc.userID,
        postID: commentDoc.postID,
        commentID: commentDoc.commentID,
        likes: commentDoc.likes,
        dislikes: commentDoc.dislikes,
        reported: commentDoc.reported,
        timestamp: commentDoc.timestamp,
        local: commentDoc.local
    }

    return commentObj
}

export async function createComment(commentString, postID) {
    let commentID = Math.random().toString(36).substr(2, 9) //Generate unique comment ID
    let isLocalComment = isLocal(postID)
    let newComment = {}

    //Making sure Generated ID is unique 
    while (db.collection('comments').doc(commentID) == undefined) {
        commentID = Math.random().toString(36).substr(2, 9)
        console.log("bad key")
    }

    newComment = {
        comment: commentString,
        userID: currentUserObj.userID,
        postID: postID,
        commentID: commentID,
        likes: 0,
        dislikes: 0,
        reported: false,
        timestamp: Date.now(),
        local: isLocalComment
    }

    db.collection('comments').doc(commentID).set({
        comment: commentString,
        userID: currentUserObj.userID,
        postID: postID,
        commentID: commentID,
        likes: 0,
        dislikes: 0,
        reported: false,
        timestamp: Date.now(), //firebase.firestore.FieldValue.serverTimestamp(),
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

function isLocal(postID) {
    //TODO
    return true
}