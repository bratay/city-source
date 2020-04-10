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
    let commentID = Math.random().toString(36).substr(2, 9) //Generate unique comment ID
    let isLocalComment = isLocal(postID)
    let newComment = {}
    let timestamp = Date.now()

    //Making sure Generated ID is unique 
    while (db.collection('comments').doc(commentID) == undefined) {
        commentID = Math.random().toString(36).substr(2, 9)
    }

    newComment = {
        comment: commentString,
        userID: currentUserObj.userID,
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

function isLocal(postID) {
    //TODO
    return true
}

export async function commentLikeTest(){
    let result = await likeComment("55cc1r8e7")
    console.log("Result - " + result)
}

export async function commentDislikeTest(){
    let result = await dislikeComment("55cc1r8e7")
    console.log("Result - " + result)
}

export async function likeComment(commentID) {
    if (currentUserObj.userID == 0) 
        return false;

    const collect = db.collection('comments').where('commentID', '==', commentID)
    let result = await collect.get().then( async q => {
        let suc
        await q.forEach(queriedDocs => {
            if (queriedDocs.empty)
                suc = false;

            let likesList = queriedDocs.data().likes;
            let dislikesList = queriedDocs.data().dislikes;

            if (likesList.includes(currentUserObj.userID) == true) {
                suc = false;
            } else {
                db.collection('comments').doc(commentID).update({
                    likes: firebase.firestore.FieldValue.arrayUnion(
                        currentUserObj.userID
                    )
                })

                //remove from dislikes list
                if(dislikesList.includes(currentUserObj.userID) == true){
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
    if (currentUserObj.userID == 0) 
        return false;

    const collect = db.collection('comments').where('commentID', '==', commentID)
    let result = await collect.get().then( async q => {
        let suc
        await q.forEach(queriedDocs => {
            if (queriedDocs.empty)
                suc = false;

            let likesList = queriedDocs.data().likes;
            let dislikesList = queriedDocs.data().dislikes;

            if (dislikesList.includes(currentUserObj.userID) == true) {
                suc = false;
            } else {
                db.collection('comments').doc(commentID).update({
                    dislikes: firebase.firestore.FieldValue.arrayUnion(
                        currentUserObj.userID
                    )
                })

                //remove from likes list
                if(likesList.includes(currentUserObj.userID) == true){
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
