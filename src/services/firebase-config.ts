import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "atto-rpg.firebaseapp.com",
  projectId: "atto-rpg",
  storageBucket: "atto-rpg.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_API_ID,
};

const app = initializeApp(
  typeof window !== 'undefined' ? firebaseConfig : {}
);

export const auth = getAuth(app);