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
import { Welcome } from "../components/welcome";
import { Toaster, toast } from "react-hot-toast";
import { useSelector, useDispatch } from 'react-redux';
import { setUser, logout } from '../store/slice/authSlice';
import { fetchPopularAnime } from '../store/thunks/animeThunks';
import { Loading } from '../components/ui/loading';

function App() {
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // 300ms delay
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { popularAnime, loading, error } = useSelector((state) => state.anime);
  const [searchResults, setSearchResults] = useState(popularAnime)
  const dispatch = useDispatch();
  
  useEffect(() => {
    setSearchResults(popularAnime);
  }, [popularAnime]);

  useEffect(() => {
    dispatch(fetchPopularAnime());
  }, [dispatch]);

  console.log(loading);
 
  // Add this useEffect for handling debounced search
  useEffect(() => {
    if (debouncedSearchQuery) {
      console.log('Popular Anime before filter:', popularAnime.map(a => `${a.id}-${a.title}`));
      
      const results = popularAnime.filter((anime) => 
        anime.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults(popularAnime);
    }
  }, [debouncedSearchQuery, popularAnime]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user.uid));
        setUserId(user.uid);
      } else {
        // User is signed out
        setUserId(null);
        dispatch(logout());
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once when component mounts

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

  const handleAddMovie = async (movie, status) => {
    if (!userId) return;
    
    try {
      const moviesRef = collection(db, "users", userId, "anime");
      
      // First check if movie already exists
      const q = query(moviesRef, where("id", "==", movie.id));
      const querySnapshot = await getDocs(q);
      
     if (querySnapshot.empty) {
      // Add new movie
      await addDoc(moviesRef, {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        poster: movie.poster,
        status: status,
        createdAt: serverTimestamp(),
      });
      toast.success(`Movie added to ${status} list`);
    } else {
      const existingMovie = querySnapshot.docs[0];
      const currentStatus = existingMovie.data().status;

      // Check if movie is already in the selected status
      if (currentStatus === status) {
        toast.error(`Movie is already in ${status} list`);
        return;
      }

      // Update to new status
      const docRef = doc(moviesRef, existingMovie.id);
      await updateDoc(docRef, {
        status: status
      });
      toast.success(`Movie moved to ${status} list`);
    }
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  return (
    <div>
      <Toaster />
      <Header onLogin={handleLogin} onLogout={handleLogout} isLoggedIn={isLoggedIn}/>
      <main className="container mx-auto px-4 py-8">
        {isLoggedIn ? (
          <div>
            <Navbar />
            <SearchBar onSearch={handleSearch} value={searchQuery}/>
            {loading ? (
              <Loading />
            ) : (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Search Results</h2>
                <MovieList movies={searchResults} onAddMovie={handleAddMovie} uid={userId} />
              </div>
            )}
          </div>
        ) : (
          <Welcome onLogin={handleLogin} />
        )}
      </main>
    </div>
  )
}

export default App