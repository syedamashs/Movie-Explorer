import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB263nOROY5R1f91_fFDbdFs4HQva2uDUc",
    authDomain: "movie-explorer-ba175.firebaseapp.com",
    projectId: "movie-explorer-ba175",
    storageBucket: "movie-explorer-ba175.firebasestorage.app",
    messagingSenderId: "340201428202",
    appId: "1:340201428202:web:4266f2d310a4ddc1ed7393"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);