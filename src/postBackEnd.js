import { db } from './index.js';
import { currentUserObj, userExist } from './signIn.js';

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

    commentsObjList.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1)

    return commentsObjList
}

function createCommentObj(commentDoc) {
    let commentObj = {}

    commentObj = {
        comment = commentDoc.comment,
        userID = commentDoc.userID,
        postID = commentDoc.postID,
        commentID = commentDoc.commentID,
        likes = commentDoc.likes,
        dislikes = commentDoc.dislikes,
        reported = commentDoc.reported,
        timestamp = commentDoc.timestamp,
        local = commentDoc.local
    }

    return commentObj
}

export async function createComment(commentString, postID) {
    let commentID = Math.random().toString(36).substr(2, 9) //Generate unique comment ID
    let isLocalComment = isLocal()
    let newComment = {}

    //Making sure Generated ID is unique 
    while (db.collection('comment').doc(commentID) == undefined)
        commentID = Math.random().toString(36).substr(2, 9)

    newComment = {
        comment = commentString,
        userID = currentUserObj.userID,
        postID = postID,
        commentID = commentID,
        likes = 0,
        dislikes = 0,
        reported = false,
        timestamp = 0,//TODO
        local = isLocalComment
    }

    db.collection('comment').doc(commentID).set({
        newComment
    })

    return newComment
}

function isLocal() {
    let local = true
    //TODO
    return local
}