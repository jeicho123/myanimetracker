import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, signOut, signInAnonymously } from 'firebase/auth';
import { auth, googleProvider, db } from '../config/firebase';
import { useDispatch } from 'react-redux';
import { setUser, logout } from '../store/slice/authSlice';

export const useAuthHandlers = () => {
  const dispatch = useDispatch();

  const handleLogin = async () => {
    console.log("Attempting Google login...");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      dispatch(setUser(result.user.uid));
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName || "Anonymous",
          email: user.email || null,
          photoURL: user.photoURL || null,
          joinedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAnonymousLogin = async () => {

    console.log("Attempting anonymous login...");
    try {
      const result = await signInAnonymously(auth);
      dispatch(setUser(result.user.uid));
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: "Anonymous User",
          email: null,
          photoURL: null,
          joinedAt: serverTimestamp(),
          isAnonymous: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
    } catch (err) {
      console.log(err);
    }
  };

  return { handleLogin, handleLogout, handleAnonymousLogin };
}; 