import { db } from '../config/firebase'
import { collection, getDocs, addDoc, serverTimestamp, doc, updateDoc, where, query } from 'firebase/firestore'
import { useEffect } from 'react'
import Header from './ui/header'
import SearchBar from "./ui/searchbar";
import MovieList from "./MovieList";
import { Navbar } from "./ui/navbar";
import { Welcome } from "./Welcome";
import { Toaster, toast } from "react-hot-toast";
import { useSelector, useDispatch } from 'react-redux';
import { Loading } from './ui/loading';
import { useAuthHandlers } from '../hooks/useAuthHandlers';
import { useAnimeSearch } from '../hooks/useAnimeSearch';
import { useAuthListener } from '../hooks/useAuthListener';

function AnimeDiscoveryPage({ title, fetchAnimeAction, animeSelector }) {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.anime);
  const animeList = useSelector(animeSelector);
  const dispatch = useDispatch();
  const { handleLogin, handleLogout, handleAnonymousLogin } = useAuthHandlers();
  const { searchQuery, searchResults, handleSearch } = useAnimeSearch(animeList);
  useAuthListener();

  useEffect(() => {
    dispatch(fetchAnimeAction());
  }, [dispatch, fetchAnimeAction]);

  const handleAddMovie = async (movie, status) => {
    if (!user) return;
    
    try {
      const moviesRef = collection(db, "users", user, "anime");
      const q = query(moviesRef, where("id", "==", movie.id));
      const querySnapshot = await getDocs(q);
      
     if (querySnapshot.empty) {
      await addDoc(moviesRef, {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        poster: movie.poster,
        status: status,
        createdAt: serverTimestamp(),
      });
      toast.success(`Added to ${status} list`);
    } else {
      const existingMovie = querySnapshot.docs[0];
      const currentStatus = existingMovie.data().status;

      if (currentStatus === status) {
        toast.error(`Already in ${status} list`);
        return;
      }

      const docRef = doc(moviesRef, existingMovie.id);
      await updateDoc(docRef, {
        status: status,
        createdAt: serverTimestamp()
      });
      toast.success(`Moved to ${status} list`);
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
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <MovieList movies={searchResults} onAddMovie={handleAddMovie} uid={user} />
              </div>
            )}
          </div>
        ) : (
          <Welcome onLogin={handleLogin} onAnonymousLogin={handleAnonymousLogin} />
        )}
      </main>
    </div>
  )
}

export default AnimeDiscoveryPage;