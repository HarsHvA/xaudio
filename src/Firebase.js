import { initializeApp } from "firebase/app";
import * as firebaseStorage from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBfuBdouw0wIxKMzHlYpaGHhgZYIT6RZKM",
    authDomain: "xaudio-74e37.firebaseapp.com",
    projectId: "xaudio-74e37",
    storageBucket: "xaudio-74e37.appspot.com",
    messagingSenderId: "890941834100",
    appId: "1:890941834100:web:bfe700ac743403f468e221"
  };

export const app = initializeApp(firebaseConfig);
export const storage = firebaseStorage;