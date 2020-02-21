import * as firebase from 'firebase';
import { db } from './index.js';
import { currentUserObj, userExist } from './signIn.js';

export var profileSearchList = []

export function getUserProfileObj(userKey) {

    if(userKey === currentUserObj.userID)
        return currentUserObj
    else if (!userExist(userKey))
        return false

    let rawUser = db.collection('user').doc(userKey)

    let userObj = {
        bio: "",
        email: "",
        hometown: "",
        hometownCoor: new firebase.firestore.GeoPoint( 0, 0),
        picUrl: "",
        userID: 0,
        username: "",
        userType: 0
    }

    rawUser.get().then(function (doc) {
        if (!doc.exists) {
            // doc.data() will be undefined in this case
            console.log("No such document");
        } else {
            console.log("Document data for test:", doc.data());

            userObj = {
                bio: doc.bio,
                hometown: doc.hometown,
                hometownCoor: new firebase.firestore.GeoPoint( 0, 0),
                email: doc.email,
                picUrl: doc.picUrl,
                userID: doc.userID,
                username: doc.username,
                userType: doc.userType
            }
        }

    }).catch(function (error) {
        console.log("Error getting document:", error);
    });

    return userObj
}

export function getUserPost(userKey) {
    let listOfPost = [];
    let queryResult = db.collection('post').where('userID', '==', userKey)

    queryResult.get().then(queriedDocs => {
        if (queriedDocs.empty === false) {
            queriedDocs.forEach(singleDoc => {

                let currentPost = {
                    comments: singleDoc.comments,
                    devPost: singleDoc.devPost,
                    pic: singleDoc.pic,
                    postID: singleDoc.postID,
                    timestamp: singleDoc.timestamp, //how are we doing time 
                    title: singleDoc.title,
                    userID: singleDoc.userID
                }

                listOfPost.push(currentPost)
            })
        } else {
            console.log("This user doesn't have any post");
        }
    });

    return listOfPost
}

export function dynamicProfileSearch(currentInput){
    var maxHeap = new PriorityQueue() //to sort distance
    var hasSeen = new Set() //to make sure we don't show the same user, stores userID
    let result = []

    //limiting amount of results from query
    var profileCandidates = db.ref('users').where('userName', '==', currentInput)
        .limitToFirst(100);
    
    //calculate distance from current user
    //put in max heap of size 20 to be used by front end
    profileCandidates.get().then( allProfileDocs => {
        allProfileDocs.forEach( profile => {
            if(hasSeen.has(profile.userID))
                continue

            hasSeen.add( profile.userID )

            let dis = getDisFromCurUser( profile.GeoPoint.lat(), profile.GeoPoint.long() )

            if(maxHeap.length < 20 ){
                maxHeap.enqueue( profile, dis )
            }else if( dis < maxHeap.front().priority ){
                maxHeap.dequeue()
                maxHeap.enqueue( profile, dis )
            }
        })
    })

    let tempHeap = maxHeap
    // tempHeap.sort(function(a, b){return a-b});
    // result = tempHeap

    for(let i = 0; i < 20; i++){
        result.push(tempHeap.front())
        tempHeap.dequeue()
    }

    return result
}

function getDisFromCurUser(lat, long){
    var sum = Math.pow( currentUserObj.hometownCoor.lat() - lat   , 2) + Math.pow( currentUserObj.hometownCoor.long() - long, 2 )
    return Math.sqrt( sum )
}
