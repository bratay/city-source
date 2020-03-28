import { db } from './index.js';
import { currentUserObj, userExist } from './signIn.js';

//Returns a list of comments obj in chronological order with a local or non-local flag
export async function getCommentsFromPost(postID){
    var commentsObjList = []
    var postComments = db.collection('comments').where('postID', '==', postID)

    await postComments.get().then(allCommments => {
        allCommments.forEach( comment => {
            comment = createCommentObj(comment)
            commentsObjList.push(comment)
        })
    })

    commentsObjList.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1)

    return commentsObjList
}

function createCommentObj(commentDoc){
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