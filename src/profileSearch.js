import { db } from './index.js';
import { currentUserObj } from './signIn.js';

export var profileSearchList = []

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
    currentInput = input.toLowerCase()

    if (currentInput.length == 1 && currentInput.length > lastLength ) {//get all users
        await getAllUsers()
    } else if (currentInput.length > lastLength && currentInput.length == 2) {//full add
        await fullAdd(currentInput)
    } else if (currentInput.length > lastLength && currentInput.length >= 2) {//add letter
        await addLetter(currentInput)
    } else if (currentInput.length < lastLength && currentInput.length >= 2) {//remove letter
        await removeLetter(currentInput)
    } else if (currentInput.length < lastLength && currentInput.length < 2) {//reset
        profileSearchList = []
    }

    lastLength = currentInput.length
}

async function getAllUsers() {
    let preInput = currentInput
    allUsers = []
    var usersTemp = db.collection('users')
    
    await usersTemp.get().then(allProfileDocs => {
        allProfileDocs.forEach(profile => {
            //calculate distance from current user and caches results
            let dis = getDisFromCurUser(profile.data().hometownCoor[0], profile.data().hometownCoor[1])
            allUsers.push(createObjectWithDis(profile, dis))
        })
    })
    
    allUsers.sort((a, b) => (a.username > b.username) ? 1 : -1)
    
    //The user typed REALLY fast
    if(currentInput != preInput)
        fullAdd(currentInput)
}

function rangeSearchUser(start) {
    var result = [];
    for (var i = 0; i < allUsers.length; i++) {
        // searchs the string for the input 
        //i.e. input: "nde" will return "BraNDEn taylor"
        if (allUsers[i].username.toLowerCase().search(start) != -1)
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
    let result = user.username.slice(0, currentInput.length).toLowerCase() == currentInput.toLowerCase()
    
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
    
    var listLength = (cache.length >= 20) ? 20 : cache.length
    
    for (let i = 0; i < listLength; i++) {
        profileSearchList.push(cache[i])
    }
    
    //alphabetical sort
    profileSearchList.sort((a, b) => (a.username > b.username) ? 1 : -1)
}

function searchTrash(user) {
    let result = user.username.slice(0, currentInput.length).toLowerCase() != currentInput.toLowerCase()
    
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

//Simple distance function
function getDisFromCurUser(lat, long) {
    var sum = Math.pow(currentUserObj.hometownCoor[0] - lat, 2) + Math.pow(currentUserObj.hometownCoor[1] - long, 2)
    return Math.sqrt(sum)
}
