import { db } from './index.js';
import { currentUserObj, userExist } from './signIn.js';

export var profileSearchList = []//should be alphabetical order // but it's Not right now

var allUsers = []
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
export async function dynamicProfileSearch(input) {
    currentInput = input

    if (input.length == 1) {
        console.log("get all users")
        await getAllUsers()
    } else if (currentInput.length > lastLength && currentInput.length == 2) {
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
    var usersTemp = db.collection('users')

    await usersTemp.get().then(allProfileDocs => {
        allProfileDocs.forEach(profile => {
            //calculate distance from current user and caches results
            let dis = 10//getDisFromCurUser(profile.data().hometownCoor[0], profile.data().hometownCoor[1])
            allUsers.push(createObjectWithDis(profile, dis))
        })
    })
    console.log("d")
    allUsers.sort((a, b) => (a.username > b.username) ? 1 : -1)
}

function rangeSearchUser(start) {
    var result = [];
    for (var i = 0; i < allUsers.length; i++) {
        // if( allUsers[i].username.startsWith(start))
        if (allUsers[i].username.search(start) != -1)
            result.push(allUsers[i])
    }
    return result
}

//updates the profile Search List
//But does a fresh querey to Firebase
async function fullAdd() {
    //Fresh cache and trash
    cache = []
    trash = []

    //limiting amount of results from query
    cache = rangeSearchUser(currentInput)

    //sort cache by distance from current user
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
