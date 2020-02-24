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

//convert epoch time (number of seconds from 1/1/1970) to
//month day year hours:minutes:seconds
export function getTimeDate(epochSeconds) {
    var rawDate = new Date(epochSeconds * 1000).toString()

    var formattedDate = rawDate.slice(4, 10) // date
    formattedDate += " " + rawDate.slice(11, 24) //time

    return formattedDate
}

///////////////////////////////////////////////////////
//Profile search
///////////////////////////////////////////////////////
export var profileSearchList = []//should be alphabetical order // but it's Not right now

var cache = []
var trash = []
var lastLength = 0;

function createObjectWithDis(doc, distance) {
    var fullObject = {
        bio: doc.bio,
        hometown: doc.hometown,
        hometownCoor: doc.hometownCoor,
        email: doc.email,
        picUrl: doc.picUrl,
        userID: doc.userID,
        username: doc.username,
        userType: doc.userType,
        dis: distance
    }

    return fullObject
}

//main func for search
export function dynamicProfileSearch(currentInput) {
    if (currentInput.length > lastLength && currentInput.length == 2) {
        fullAdd(currentInput)
    } else if (currentInput.length > lastLength && currentInput.length > 2) {
        addLetter(currentInput)
    } else if (currentInput.length < lastLength && currentInput.length > 2) {
        removeLetter(currentInput)
    } else if (currentInput.length < lastLength && currentInput.length < 2) {
        profileSearchList = []
    }

    lastLength = currentInput.length
}

//updates the profile Search List
//But does a fresh querey to Firebase
function fullAdd(currentInput) {
    //Fresh cache and trash
    cache = []
    trash = []

    //limiting amount of results from query
    var profileCandidates = db.ref('users').where('userName', '==', currentInput)
        .limitToFirst(100);

    //calculate distance from current user
    //put in max heap of size 20 to be used by front end
    profileCandidates.get().then(allProfileDocs => {
        allProfileDocs.forEach(profile => {
            let dis = getDisFromCurUser(profile.GeoPoint.lat(), profile.GeoPoint.long())
            cache.push(createObjectWithDis(profile, dis))
        })
    })

    //sort cache by distance from current user
    cache.sort((a, b) => (a.dis > b.dis) ? 1 : -1)

    profileSearchList.clear()

    var numResults = (cache.length > 20) ? 20 : cache.length

    for (let i = 0; i < numResults; i++) {
        profileSearchList.push(cache[i])
    }
}

//updates the profile Search List
//But with out new firebase querey only with cache
function addLetter(currentInput) {

}

//updates the profile Search List
//When letter is removed
function removeLetter(currentInput) {

}

//Simple distance func
function getDisFromCurUser(lat, long) {
    var sum = Math.pow(currentUserObj.hometownCoor.lat() - lat, 2) + Math.pow(currentUserObj.hometownCoor.long() - long, 2)
    return Math.sqrt(sum)
}
