import * as firebase from 'firebase';
import { db } from './index.js';
import { currentUserObj, userExist } from './signIn.js';

export function storeUserImage(user_id, file){
  var storageRef = firebase.storage().ref();
  var uploadTask = storageRef.child('images/users/' + user_id + '/' + file.name).put(file);
  uploadTask.on('state_changed', function(snapshot){
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED:
        console.log('Upload paused');
        break;
      case firebase.storage.TaskState.RUNNNING:
        console.log('Upload is running');
        break;
    }
  }, function(error){
    switch (error.code) {
      case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;
      case 'storage/canceled':
      // User canceled the upload
      break;
      case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
      break;
    }
  }, function() {
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      console.log('File available at ', downloadURL);
    });
  });
}

export function storePostImage(post_id, file){
  var storageRef = firebase.storage().ref();
  var uploadTask = storageRef.child('images/post/' + post_id + '/' + file.name).put(file);
  uploadTask.on('state_changed', function(snapshot){
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED:
        console.log('Upload paused');
        break;
      case firebase.storage.TaskState.RUNNNING:
        console.log('Upload is running');
        break;
    }
  }, function(error){
    switch (error.code) {
      case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;
      case 'storage/canceled':
      // User canceled the upload
      break;
      case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
      break;
    }
  }, function() {
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      console.log('File available at ', downloadURL);
    });
  });
}

export function getUserImage(user_id){
  var imageList = [];
  var storageRef = firebase.storage().ref();
  var folderRef = storageRef.child('images/user/'+user_id);
  folderRef.listAll().then(function(result) {
    result.items.forEach(function(imageRef) {
      imageList.push(url);
      // imageRef.getDownloadURL().then(function(url) {
      //   var img = document.getElementById
      //   imageList.push(url);
      // })
    })
  });
  return imageList;
}

export function getPostImage(user_id){
  var imageList = [];
  var storageRef = firebase.storage().ref();
  var folderRef = storageRef.child('images/post/'+user_id);
  folderRef.listAll().then(function(result) {
    result.items.forEach(function(imageRef) {
      imageList.push(url);
      // imageRef.getDownloadURL().then(function(url) {
      //   var img = document.getElementById
      //   imageList.push(url);
      // })
    })
  });
  return imageList;
}
