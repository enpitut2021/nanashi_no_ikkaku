// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
if (!firebase.apps.length) {
    firebase.initializeApp({
  apiKey: "AIzaSyBMeVaTF55aTMLzek5vs0qEGdghC8DKDk0",
  authDomain: "nanashino-ikkaku.firebaseapp.com",
  projectId: "nanashino-ikkaku",
  storageBucket: "nanashino-ikkaku.appspot.com",
  messagingSenderId: "511488131268",
  appId: "1:511488131268:web:e328facc1d3d9111ebc991",
  measurementId: "G-K7FV8G5FZM"
    })
}

firebase.firestore().settings({
  ignoreUndefinedProperties: true,
})

export default firebase
