import * as firebase from 'firebase';
import { db } from './index.js';
import { currentUserObj } from './signIn.js';

export function createpost(postObject) {
    let postID = "Temp post ID" //Generate a new ID
    let newpost = {}
    let timestamp = Date.now()

    newpost = {
        address: postObject.address,
        comments: [],
        coor: postObject.coor,
        devpost: postObject.devpost,
        dislikes: [],
        likes: [],
        postID: postID,
        userID: currentUserObj.userID,
        text: postObject.text,
        timestamp: timestamp
    }

    db.collection('post').doc(postID).set({
        address: postObject.address,
        comments: [],
        coor: postObject.coor,
        devpost: postObject.devpost,
        dislikes: [],
        likes: [],
        postID: postID,
        userID: currentUserObj.userID,
        text: postObject.text,
        timestamp: timestamp
    })

    return newpost
}

///////////////////////////////////////////////////////
//Post gets and sets
///////////////////////////////////////////////////////

export async function likePost(postID) {
    if (currentUserObj.userID == 0) 
        return false;

    const collect = db.collection('post').where('postID', '==', postID)
    let result = await collect.get().then( async q => {
        let suc
        await q.forEach(queriedDocs => {
            if (queriedDocs.empty)
                suc = false;

            let likesList = queriedDocs.data().likes;
            let dislikesList = queriedDocs.data().dislikes;

            if (likesList.includes(currentUserObj.userID) == true) {
                suc =  false;
            } else {
                db.collection('post').doc(postID).update({
                    likes: firebase.firestore.FieldValue.arrayUnion(
                        currentUserObj.userID
                    )
                })

                //remove from dislikes list
                if(dislikesList.includes(currentUserObj.userID) == true){
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
    if (currentUserObj.userID == 0) 
        return false;

    const collect = db.collection('post').where('postID', '==', postID)
    let result = await collect.get().then( async q => {
        let suc
        await q.forEach(queriedDocs => {
            if (queriedDocs.empty)
                suc = false;

            let likesList = queriedDocs.data().likes;
            let dislikesList = queriedDocs.data().dislikes;

            if (dislikesList.includes(currentUserObj.userID) == true) {
                suc =  false;
            } else {
                db.collection('post').doc(postID).update({
                    dislikes: firebase.firestore.FieldValue.arrayUnion(
                        currentUserObj.userID
                    )
                })

                //remove from likes list
                if(likesList.includes(currentUserObj.userID) == true){
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

export function getAddress(postID) {
    const collect = db.collection('post')//get wanted collection
    var query = collect.where('postID', '==', postID)
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

export function setAddress(postID, newAddress) {
    db.collection('post').doc(postID).update({
        addres: newAddress
    }).catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        return false
    });
    return true
}

export function setPostID(post_doc, newPostID) {
    db.collection('post').doc(post_doc).update({
        postID: newPostID
    }).catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        return false
    });
    return true
}

export function getTimeStamp(postID) {
    const collect = db.collection('post')//get wanted collection
    var query = collect.where('postID', '==', postID)
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
export function setTimeStamp(post_doc, newTimeStamp) {
    db.collection('post').doc(post_doc).update({
        timestamp: newTimeStamp
    }).catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        return false
    });
    return true
}

export function getTitle(postID) {
    const collect = db.collection('post')//get wanted collection
    var query = collect.where('postID', '==', postID)
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
export function setTitle(post_doc, newTitle) {
    db.collection('post').doc(post_doc).update({
        title: newTitle
    }).catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        return false
    });
    return true
}


export function getUserId(postID) {
    const collect = db.collection('post')//get wanted collection
    var query = collect.where('postID', '==', postID)
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
export function setUserId(post_doc, newUserID) {
    db.collection('post').doc(post_doc).update({
        userID: newUserID
    }).catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        return false
    });
    return true
}
