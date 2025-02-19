import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { db } from "../../config/firebase";


const CACHE_DURATION = 5 * 60 * 1000;

export const fetchPopularAnime = createAsyncThunk(
    "anime/fetchPopularAnime",
    async (_, { getState, rejectWithValue }) => {
      const lastFetchTime = getState().anime.lastFetchTimes.popularAnime;
      if (lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
        return rejectWithValue("Cache is fresh, skipping fetch");
      }
  
      const baseUrl = "https://api.jikan.moe/v4/top/anime";
      const totalAnime = 100; // Number of anime we want
      const batchSize = 25; // Jikan returns 25 per request
      const maxRequestsPerSecond = 3; // Rate limit
      let animeList = [];
  
      try {
        for (let page = 1; animeList.length < totalAnime; page++) {
          const response = await fetch(`${baseUrl}?page=${page}`);
          const data = await response.json();
  
          if (!data.data || data.data.length === 0) break; // Stop if no more data

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
  
          // Rate limiting: Pause if needed
          if (page % maxRequestsPerSecond === 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
          }
        }
  
        return animeList.slice(0, totalAnime).map((anime) => ({
          id: anime.mal_id,
          title: anime.title,
          year: anime.aired?.prop?.from?.year || "Unknown",
          poster: anime.images?.jpg?.image_url || "/placeholder.svg?height=300&width=200",
        }));
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

export const fetchWatchedAnime = createAsyncThunk(
  "anime/fetchWatchedAnime",
  async (userId, { rejectWithValue }) => {
    if (!userId) return rejectWithValue("No user ID provided");

    try {
      const moviesRef = collection(db, "users", userId, "anime");
      const q = query(
        moviesRef, 
        where("status", "==", "watched"),
        orderBy("createdAt", "asc")
      );
      const data = await getDocs(q);
      return data.docs.map((doc) => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toMillis() || Date.now(),
        docId: doc.id,
      }));
    } catch (error) {
        const errorMessage = error.message ? String(error.message) : "Unknown error occurred";
        return rejectWithValue(errorMessage);
    }
  }
);
