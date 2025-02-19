import './App.css'
import { db } from '../config/firebase'
import { collection, getDocs, addDoc, serverTimestamp, orderBy, query, deleteDoc, doc, getDoc, setDoc, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import Header from '../components/ui/header'
import {auth, googleProvider} from "../config/firebase";
import {signInWithPopup, signOut, onAuthStateChanged} from "firebase/auth";
import SearchBar from "../components/ui/searchbar";
import MovieList from "../components/movielist";
import { useDebounce } from '../hooks/useDebounce';
import { Navbar } from "../components/ui/navbar";
import { useSelector, useDispatch } from 'react-redux';
import { setUser, logout } from '../store/slice/authSlice';
import { Welcome } from '../components/welcome';
import { fetchWatchedAnime } from '../store/thunks/animeThunks';


function Watched() {
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // 300ms delay
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const { watchedAnime, loading, error } = useSelector((state) => state.anime);
  const [searchResults, setSearchResults] = useState(watchedAnime)
  const dispatch = useDispatch();
  
  useEffect(() => {
    setSearchResults(watchedAnime);
  }, [watchedAnime]);

  useEffect(() => {
    dispatch(fetchWatchedAnime(user));
  }, [dispatch, user]);
  
  // Add this useEffect for handling debounced search
  useEffect(() => {
    if (debouncedSearchQuery) {
      const results = watchedAnime.filter((movie) => 
        movie.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults(watchedAnime);
    }
  }, [debouncedSearchQuery, watchedAnime]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  }

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      dispatch(setUser(result.user.uid));
      const user = result.user;
      setUserId(user.uid);

      const userRef = doc(db, "users", user.uid);

      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // If user doesn't exist, create a new document
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
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      setUserId(null);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteMovie = async (docId) => {
    try {
      const movieDoc = doc(db, "users", userId, "watched", docId);
      await deleteDoc(movieDoc);
      dispatch(fetchWatchedAnime(user));
    } catch (e) {
      console.error("Error deleting movie:", e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        dispatch(setUser(user.uid));
    

      } else {
        // User is signed out
        setUserId(null);
        dispatch(logout());
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <div>
      <Header onLogin={handleLogin} onLogout={handleLogout} isLoggedIn={isLoggedIn}/>
      <main className="container mx-auto px-4 py-8">
        {isLoggedIn ? (
          <div>
            <Navbar />
            <SearchBar onSearch={handleSearch} value={searchQuery}/>
            {<div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Watched Movies</h2>
                <MovieList movies={searchResults} onDeleteMovie={handleDeleteMovie} uid={userId} />
              </div>
            }
          </div>
        ) : (
          <Welcome onLogin={handleLogin} />
        )}
      </main>
    </div>
  )
}

export default Watched;
