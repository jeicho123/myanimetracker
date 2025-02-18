import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCwJMVxsVDxTYZ0a7LhF0KdQdrAefBgckY",
  authDomain: "moviez-b2975.firebaseapp.com",
  projectId: "moviez-b2975",
  storageBucket: "moviez-b2975.firebasestorage.app",
  messagingSenderId: "333304630032",
  appId: "1:333304630032:web:ed31e3cc37b8a850b6f395",
  measurementId: "G-6YXEYRSC66"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
