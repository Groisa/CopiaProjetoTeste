// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCSjTCgp1-2ZGTLTOGpeqI8gmN2RSa30VU",
    authDomain: "projetocaminhao.firebaseapp.com",
    projectId: "projetocaminhao",
    storageBucket: "projetocaminhao.appspot.com",
    messagingSenderId: "1093176108703",
    appId: "1:1093176108703:web:845968589e1182d68fa4aa"
  };
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
// Initialize Firebase