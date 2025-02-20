import { db } from '../config/firebase'
import { collection, getDocs, serverTimestamp, deleteDoc, doc, where, updateDoc, query } from 'firebase/firestore'
import { useEffect } from 'react'
import Header from './ui/header'
import SearchBar from "./ui/searchbar";
import MovieList from "./MovieList";
import { Navbar } from "./ui/navbar";
import { useSelector, useDispatch } from 'react-redux';
import { Welcome } from './Welcome';
import { Toaster, toast } from "react-hot-toast";
import { useAuthHandlers } from '../hooks/useAuthHandlers';
import { useAnimeSearch } from '../hooks/useAnimeSearch';
import { useAuthListener } from '../hooks/useAuthListener';

function AnimeListPage({ title, fetchAnimeAction, animeSelector }) {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const animeList = useSelector(animeSelector);
  const dispatch = useDispatch();
  const { handleLogin, handleLogout, handleAnonymousLogin } = useAuthHandlers();
  const { searchQuery, searchResults, handleSearch } = useAnimeSearch(animeList);
  useAuthListener();

  useEffect(() => {
    dispatch(fetchAnimeAction(user));
  }, [dispatch, user, fetchAnimeAction]);

  const handleSwitchMovie = async (movie, status) => {
    if (!user) return;
    
    try {
      const moviesRef = collection(db, "users", user, "anime");
      const q = query(moviesRef, where("id", "==", movie.id));
      const querySnapshot = await getDocs(q);
      const existingMovie = querySnapshot.docs[0];

      const docRef = doc(moviesRef, existingMovie.id);
      await updateDoc(docRef, {
        status: status,
        createdAt: serverTimestamp()
      });
      dispatch(fetchAnimeAction(user));
      toast.success(`Moved to ${status} list`);
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  const handleDeleteMovie = async (docId) => {
    try {
      const movieDoc = doc(db, "users", user, "anime", docId);
      await deleteDoc(movieDoc);
      dispatch(fetchAnimeAction(user));
    } catch (e) {
      console.error("Error deleting movie:", e);
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
            {<div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <MovieList 
                  movies={searchResults} 
                  onDeleteMovie={handleDeleteMovie} 
                  onSwitchMovie={handleSwitchMovie} 
                  uid={user} 
                />
              </div>
            }
          </div>
        ) : (
          <Welcome onLogin={handleLogin} onAnonymousLogin={handleAnonymousLogin} />
        )}
      </main>
    </div>
  )
}

export default AnimeListPage;