// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import firebase from "firebase";

var firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAxTqiEkIHCiCGupoh3Vi6quNFMfrm5dzg",
    authDomain: "instagram-clone-ff1a1.firebaseapp.com",
    projectId: "instagram-clone-ff1a1",
    storageBucket: "instagram-clone-ff1a1.appspot.com",
    messagingSenderId: "155929189336",
    appId: "1:155929189336:web:bfb5bc35db7d1990bbb0ad",
    measurementId: "G-B3TBCPR3V0"
});

let db = firebaseApp.firestore();
let auth = firebase.auth();
let storage = firebase.storage();

export { db, auth, storage };