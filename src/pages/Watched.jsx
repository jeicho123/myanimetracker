import { Auth } from '../components/auth'
import { NavigationMenu } from '../components/ui/navigation-menu'
import './App.css'
import { db } from '../config/firebase'
import { collection, getDocs, addDoc, serverTimestamp, orderBy, query, deleteDoc, doc, getDoc, setDoc, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import Header from '../components/ui/header'
import { Button } from "@/components/ui/button"
import {auth, googleProvider} from "../config/firebase";
import {signInWithPopup, signOut, onAuthStateChanged} from "firebase/auth";
import SearchBar from "../components/ui/searchbar";
import MovieList from "../components/movielist";
import { useReducer } from "react";
import { useDebounce } from '../hooks/useDebounce';
import { Navbar } from "../components/ui/navbar";
import { useSelector, useDispatch } from 'react-redux';
import { setUser, logout } from '../store/authSlice';
import { Welcome } from '../components/welcome';

// const placeholderMovies = [
//   { id: 1, title: "Inception", year: 2010, poster: "/placeholder.svg?height=300&width=200" },
//   { id: 2, title: "The Shawshank Redemption", year: 1994, poster: "/placeholder.svg?height=300&width=200" },
//   { id: 3, title: "The Dark Knight", year: 2008, poster: "/placeholder.svg?height=300&width=200" },
//   { id: 4, title: "Pulp Fictione", year: 1994, poster: "/placeholder.svg?height=300&width=200" },
//   { id: 5, title: "Forrest Gump", year: 1994, poster: "/placeholder.svg?height=300&width=200" },
// ];

const baseUrl = "https://api.jikan.moe/v4";

const LOADING = "LOADING";
const SEARCH = "SEARCH";
const GET_POPULAR_ANIME = "GET_POPULAR_ANIME";

const initialState = {
  popularAnime: [],
  pictures: [],
  isSearch: false,
  searchResults: [],
  loading: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case LOADING:
      return { ...state, loading: true };
    case GET_POPULAR_ANIME:
      return { ...state, popularAnime: action.payload, loading: false };
    default:
      return state;
  }
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

function Watched() {
  const [movieList, setMovieList] = useState([]) 
  const [searchResults, setSearchResults] = useState([])
  const [title, setTitle] = useState("")
  const [releaseDate, setReleaseDate] = useState(0)
  
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // 300ms delay

  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const dispatche = useDispatch();


  const movieRef = collection(db, "movies")

  const [state, dispatch] = useReducer(reducer, initialState);

  const placeholderMovies = state.popularAnime.map((anime) => ({
    id: anime.mal_id,
    title: anime.title,
    year: anime.aired?.prop?.from?.year || "Unknown",
    poster: anime.images?.jpg?.image_url || "/placeholder.svg?height=300&width=200"
  }));

  const getPopularAnime = async () => {
    // Check if we have cached data and timestamp
    const cachedData = localStorage.getItem('popularAnime');
    const lastFetchTime = localStorage.getItem('lastFetchTime');
    const currentTime = Date.now();

    // If we have cached data and it's within our cache duration, use it
    if (cachedData && lastFetchTime && (currentTime - parseInt(lastFetchTime) < CACHE_DURATION)) {
      dispatch({ type: GET_POPULAR_ANIME, payload: JSON.parse(cachedData) });
      return;
    }

    // Otherwise, fetch new data
    dispatch({ type: LOADING });
    try {
      const response = await fetch(`${baseUrl}/top/anime?filter=bypopularity`);
      const data = await response.json();
      
      // Cache the new data and timestamp
      localStorage.setItem('popularAnime', JSON.stringify(data.data));
      localStorage.setItem('lastFetchTime', currentTime.toString());
      
      dispatch({ type: GET_POPULAR_ANIME, payload: data.data });
    } catch (error) {
      console.error('Error fetching anime:', error);
      // Optionally dispatch an error action here
    }
  }


  const handleSearch = (query) => {
    setSearchQuery(query);
  }

  // Add this useEffect for handling debounced search
  useEffect(() => {
    if (debouncedSearchQuery) {
      const results = movieList.filter((movie) => 
        movie.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults(movieList);
    }
  }, [debouncedSearchQuery, movieList]);

  const getMovieList = async (userId) => {
    try {
      const moviesRef = collection(db, "users", userId, "movies");
      const q = query(moviesRef, orderBy("createdAt", "asc"));
      const data = await getDocs(q);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        docId: doc.id  // Include the Firestore document ID
      }));

      setMovieList(filteredData);
    } catch (e) {
      console.error(e);
    }
  }


  const addMovie = async () => {
    try {
      await addDoc(movieRef, {title: title, releaseDate: releaseDate, createdAt: serverTimestamp()})
      getMovieList();
    } catch (e) {
      console.error(e);
    }
  }

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id)
    await deleteDoc(movieDoc)
    getMovieList();
  }

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      dispatche(setUser(result.user.uid));
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

      getMovieList(user.uid);

    } catch (err) {
      console.log(err);
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatche(logout());
      setUserId(null);
    } catch (err) {
      console.log(err);
    }
  }

  const handleAddMovie = async (movie) => {
    console.log(userId);
    const moviesRef = collection(db, "users", userId, "movies");
    if (!movieList.some((m) => m.id === movie.id)) {
      await addDoc(moviesRef, {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        poster: movie.poster,
        createdAt: serverTimestamp(),
      });
      getMovieList(userId);
    }
  }

  const handleDeleteMovie = async (docId) => {
    try {
      const movieDoc = doc(db, "users", userId, "movies", docId);
      await deleteDoc(movieDoc);
      getMovieList(userId);
    } catch (e) {
      console.error("Error deleting movie:", e);
    }
  };

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        dispatche(setUser(user.uid));
        getMovieList(user.uid);
      } else {
        // User is signed out
        setUserId(null);
        dispatche(logout());
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
            {(
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Watched Movies</h2>
                <MovieList movies={searchResults} onDeleteMovie={handleDeleteMovie} uid={userId} />
              </div>
            )}
           
            
          </div>
        ) : (
          <Welcome onLogin={handleLogin} />
        )}
      </main>

  
      {/* <Auth />

      <div>
        <input type="text" placeholder="Movie Title" onChange={(e) => setTitle(e.target.value)}/>
        <input type="number" placeholder="Release Date" onChange={(e) => setReleaseDate(e.target.value)}/>
        <button onClick={addMovie}>Add Movie</button>
      </div>

      <div>
        {movieList.map((movie) => (
          <div>
            <h1>{movie.title}</h1>
            <p>{movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>
          </div>
        ))}
      </div> */}
    </div>
  )
}

export default Watched;
