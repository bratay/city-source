import * as firebase from 'firebase';
import { db } from './index.js';
import { currentUserObj, userExist } from './signIn.js';

export async function getUserProfileObj(userKey) {
    if (userKey === currentUserObj.userID)
        return currentUserObj

    //We aren't using this right now
    // else if (userExist(userKey))
    //     return false

    let rawUser = db.collection('users').doc(userKey)

    let userObj = {
        bio: "",
        email: "",
        hometown: "",
        hometownCoor: [0, 0],
        picUrl: "",
        userID: "",
        username: "",
        userType: 0
    }

    await rawUser.get().then(function (doc) {
        if (!doc.exists) {
            // doc.data() will be undefined in this case
            console.log("No such document");
        } else {
            userObj = {
                bio: doc.data().bio,
                hometown: doc.data().hometown,
                hometownCoor: [0, 0],
                email: doc.data().email,
                picUrl: doc.data().picUrl,
                userID: doc.data().userID,
                username: doc.data().username,
                userType: doc.data().userType
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
                    comments: singleDoc.data().comments,
                    devPost: singleDoc.data().devPost,
                    pic: singleDoc.data().pic,
                    postID: singleDoc.data().postID,
                    timestamp: singleDoc.data().timestamp, //convert from epoch to normal time date
                    title: singleDoc.data().title,
                    userID: singleDoc.data().userID
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
var currentInput = ""

function createObjectWithDis(doc, distance) {
    var fullObject = {
        bio: doc.data().bio,
        hometown: doc.data().hometown,
        hometownCoor: doc.data().hometownCoor,
        email: doc.data().email,
        picUrl: doc.data().picUrl,
        userID: doc.data().userID,
        username: doc.data().username,
        userType: doc.data().userType,
        dis: distance
    }

    return fullObject
}

//main func for search
export function dynamicProfileSearch(input) {
    currentInput = input

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
function fullAdd() {
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
    var unsortedList = []

    for (let i = 0; i < numResults; i++) {
        unsortedList.push(cache[i])
    }

    //alphabetical sort
    unsortedList.sort((a, b) => (a.username > b.username) ? 1 : -1)

    profileSearchList = unsortedList
}

//helper function for add letter
function cleanCache(user) {
    let result = user.username.slice(0, currentInput.length - 1) != currentInput

    //checking if it still matches
    if (!result) {
        trash.push(user)
    }
    return result
}

//updates the profile Search List
//But with out new firebase querey only with cache
function addLetter() {
    //Clean cache
    cache = cache.filter(cleanCache)

    profileSearchList.clear()

    var numResults = (cache.length > 20) ? 20 : cache.length

    for (let i = 0; i < numResults; i++) {
        profileSearchList.push(cache[i])
    }

    //alphabetical sort
    profileSearchList.sort((a, b) => (a.username > b.username) ? 1 : -1)
}

function searchTrash(user) {
    let result = user.username.slice(0, currentInput.length - 1) != currentInput

    if (!result) {
        cache.push(user)
    }

    return result
}

//updates the profile Search List
//When letter is removed
function removeLetter() {
    //Search Trash
    trash = trash.filter(searchTrash)

    cache.sort((a, b) => (a.dis > b.dis) ? 1 : -1)

    profileSearchList.clear()

    var numResults = (cache.length > 20) ? 20 : cache.length
    var unsortedList = []

    for (let i = 0; i < numResults; i++) {
        unsortedList.push(cache[i])
    }

    //alphabetical sort
    unsortedList.sort((a, b) => (a.username > b.username) ? 1 : -1)

    profileSearchList = unsortedList
}

//Simple distance func
function getDisFromCurUser(lat, long) {
    var sum = Math.pow(currentUserObj.hometownCoor.lat() - lat, 2) + Math.pow(currentUserObj.hometownCoor.long() - long, 2)
    return Math.sqrt(sum)
}
