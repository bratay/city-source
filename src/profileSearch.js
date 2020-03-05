import * as firebase from 'firebase';
import { db, dbRef } from './index.js';
import { currentUserObj, userExist } from './signIn.js';
import { getUserProfileObj, getUserPost } from './profileBackEnd.js';

export var profileSearchList = []//should be alphabetical order // but it's Not right now

var allUsers = []
var cache = []
var trash = []
var lastLength = 0;
var currentInput = ""

export async function testSearch() {
    console.log("a")
    await dynamicProfileSearch("B")
    console.log("==================================================================")
    dynamicProfileSearch("Brand")
}

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
export async function dynamicProfileSearch(input) {
    currentInput = input

    // if (currentInput.length > lastLength && currentInput.length == 2) {
    if (input.length == 1) {
        console.log("get all users")
        await getAllUsers()
    } else if (currentInput.length > lastLength) {
        console.log('Full add')
        fullAdd(currentInput)
    } else if (currentInput.length > lastLength && currentInput.length > 2) {
        console.log('add letter')
        addLetter(currentInput)
    } else if (currentInput.length < lastLength && currentInput.length > 2) {
        console.log('Remove letter')
        removeLetter(currentInput)
    } else if (currentInput.length < lastLength && currentInput.length < 2) {
        console.log('Reset')
        profileSearchList = []
    }

    lastLength = currentInput.length
}

async function getAllUsers() {
    console.log("b")
    var usersTemp = db.collection('users')
    console.log("c")
    await usersTemp.get().then(allProfileDocs => {
        console.log("All docs")
        allProfileDocs.forEach(profile => {
            // console.log("single docs")
            console.log(profile.data().username.toString())
            let dis = 10//getDisFromCurUser(profile.data().hometownCoor[0], profile.data().hometownCoor[1])
            allUsers.push(createObjectWithDis(profile, dis))
        })
    })
    console.log("d")
    allUsers.sort((a, b) => (a.username > b.username) ? 1 : -1)
    // console.log(allUsers)
}

function rangeSearchUser(start) {
    var result = [];
    for (var i = 0; i < allUsers.length; i++) {
        // if( allUsers[i].username.startsWith(start))
        if (allUsers[i].username.search(start) != -1)
            result.push(allUsers[i])
    }
    console.log("2")
    return result
}

//updates the profile Search List
//But does a fresh querey to Firebase
async function fullAdd() {
    //Fresh cache and trash
    cache = []
    trash = []

    //limiting amount of results from query
    // var profileCandidates = db.collection('users').where('username', '==', currentInput)
    //     .limitToFirst(100);
    // var profileCandidates = db.collection('users').where('username', '==', currentInput)
    console.log("1")
    // var profileCandidates = db.collection('users').query().startAt(currentInput)//.endAt(currentInput + "\uf8ff")

    //bWYOnaT0tCdYRhb5JozfLnpGwUk1
    // var profileCandidates = await dbRef.ref('users')//.orderByChild('username').startAt(currentInput)//.endAt(currentInput + '\uf8ff')
    // var profileCandidates = rangeSearchUser(currentInput)
    cache = rangeSearchUser(currentInput)
    console.log("Range search length" + cache.length.toString())
    // var profileCandidates = dbRef.ref('users').orderByValue()//.startAt(currentInput).endAt(currentInput + '\uf8ff')
    console.log("3")
    // console.log(profileCandidates)

    //calculate distance from current user and caches results

    // await profileCandidates.on("value", (profile) => {
    //     console.log("3")
    //     // console.log("All docs")
    //     // allProfileDocs.forEach(profile => {
    //     console.log("single docs val = " + profile.data().val())
    //     // console.log(profile.data().val())
    //     // console.log(profile.data().username.toString())
    //     let dis = 10//getDisFromCurUser(profile.data().hometownCoor[0], profile.data().hometownCoor[1])
    //     cache.push(createObjectWithDis(profile, dis))
    //     // })
    // })
    // await profileCandidates.get().then(allProfileDocs => {
    //     console.log("All docs")
    //     allProfileDocs.forEach(profile => {
    //         // console.log("single docs")
    //         console.log(profile.data().username.toString())
    //         let dis = 10//getDisFromCurUser(profile.data().hometownCoor[0], profile.data().hometownCoor[1])
    //         cache.push(createObjectWithDis(profile, dis))
    //     })
    // })

    // for (var cur in profileCandidates) {
    //     console.log(cur.toString())
    //     let dis = 10//getDisFromCurUser(profile.data().hometownCoor[0], profile.data().hometownCoor[1])
    //     cache.push(createObjectWithDis(cur, dis))
    // }

    console.log("4")
    console.log("Cache before sort")
    console.log(cache)

    //sort cache by distance from current user
    cache.sort((a, b) => (a.dis > b.dis) ? 1 : -1)

    profileSearchList = []

    var numResults = (cache.length > 20) ? 20 : cache.length
    var unsortedList = []
    console.log("unsorted List")
    console.log(unsortedList)

    for (let i = 0; i < numResults; i++) {
        unsortedList.push(cache[i])
    }

    //alphabetical sort
    unsortedList.sort((a, b) => (a.username > b.username) ? 1 : -1)

    profileSearchList = unsortedList
    console.log("sorted List")
    console.log(profileSearchList)
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

    profileSearchList = []

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

    profileSearchList = []

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
