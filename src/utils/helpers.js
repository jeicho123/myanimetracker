import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const CACHE_DURATION = 5 * 60 * 1000;

export const fetchAnimeList = async (filter = '') => {
  const baseUrl = "https://api.jikan.moe/v4/top/anime";
  const totalAnime = 100;
  const maxRequestsPerSecond = 3;
  let animeList = [];

  try {
    for (let page = 1; animeList.length < totalAnime; page++) {
      const url = filter 
        ? `${baseUrl}?page=${page}&filter=${filter}`
        : `${baseUrl}?page=${page}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!data.data || data.data.length === 0) break;

      // First filter duplicates within the incoming batch
      const uniqueIncomingAnime = Array.from(
        new Map(data.data.map(anime => [anime.mal_id, anime])).values()
      );

      // Then filter against existing animeList
      const newAnime = uniqueIncomingAnime.filter(anime => 
        !animeList.some(existing => existing.mal_id === anime.mal_id)
      );

      animeList = [...animeList, ...newAnime];

      if (animeList.length >= totalAnime) break;

      if (page % maxRequestsPerSecond === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }

    return animeList.slice(0, totalAnime).map((anime) => ({
      id: anime.mal_id,
      title: anime.title,
      year: anime.aired?.prop?.from?.year || "Unknown",
      poster: anime.images?.jpg?.image_url || "/placeholder.svg?height=300&width=200",
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchAnimeByStatus = async (userId, status) => {
  if (!userId) throw new Error("No user ID provided");

  const moviesRef = collection(db, "users", userId, "anime");
  const q = query(
    moviesRef, 
    where("status", "==", status),
    orderBy("createdAt", "asc")
  );
  const data = await getDocs(q);
  return data.docs.map((doc) => ({
    ...doc.data(),
    createdAt: doc.data().createdAt?.toMillis() || Date.now(),
    docId: doc.id,
  }));
}; 