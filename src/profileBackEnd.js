import * as firebase from 'firebase';
import { db } from './index.js';
import { currentUserObj, userExist } from './signIn.js';

export var profileSearchList = []

export function getUserProfileObj(userKey) {

    if (userKey === currentUserObj.userID)
        return currentUserObj
    else if (!userExist(userKey))
        return false

    let rawUser = db.collection('user').doc(userKey)

    let userObj = {
        bio: "",
        email: "",
        hometown: "",
        hometownCoor: new firebase.firestore.GeoPoint(0, 0),
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
                hometownCoor: new firebase.firestore.GeoPoint(0, 0),
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
                    timestamp: getTimeDate(timestamp), //convert from epoch to normal time date
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

export function getTimeDate(epochSeconds){
    var rawDate = new Date(epochSeconds*1000).toString()

    var formattedDate = rawDate.slice(4, 10) // date
    formattedDate += " " +  rawDate.slice(11, 24) //time

    return formattedDate
}

///////////////////////////////////////////////////////
//Profile search
///////////////////////////////////////////////////////
export var profileSearchList = []//should be alphabetical order // but it's Not right now

var maxHeap = new PriorityQueue() //to sort top distance
var hasSeen = new Set() //to make sure we don't show the same user, stores userID
var lastLength = 0;

//updates the profile Search List exported variable
export function dynamicProfileSearch(currentInput) {
    if(currentInput.length < 2){
        maxHeap = new PriorityQueue() //to sort top distance
        hasSeen = new Set() 
        return
    }else if(lastLength > currentInput.length){
        deleteLastCharResults()
        return
    }

    //limiting amount of results from query
    var profileCandidates = db.ref('users').where('userName', '==', currentInput)
        .limitToFirst(100);

    //calculate distance from current user
    //put in max heap of size 20 to be used by front end
    profileCandidates.get().then(allProfileDocs => {
        allProfileDocs.forEach(profile => {
            if (hasSeen.has(profile.userID))
                continue

            hasSeen.add(profile.userID)

            let dis = getDisFromCurUser(profile.GeoPoint.lat(), profile.GeoPoint.long())

            if (maxHeap.length < 20) {
                maxHeap.enqueue(profile, dis)
            } else if (dis < maxHeap.front().priority) {
                maxHeap.dequeue()
                maxHeap.enqueue(profile, dis)
            }
        })
    })

    let tempHeap = maxHeap
    profileSearchList.clear()

    for (let i = tempHeap.length; i >= 0; i--) {
        profileSearchList.push(tempHeap.front().element)
        tempHeap.dequeue()
    }
}

function deleteLastCharResults(){

}

function getDisFromCurUser(lat, long) {
    var sum = Math.pow(currentUserObj.hometownCoor.lat() - lat, 2) + Math.pow(currentUserObj.hometownCoor.long() - long, 2)
    return Math.sqrt(sum)
}

//call after done searching
export function endSearch() {
    maxHeap = new PriorityQueue() //to sort distance
    hasSeen = new Set() //to make sure we don't show the same user, stores userID
}
