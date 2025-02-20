import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAnimeList, fetchAnimeByStatus, CACHE_DURATION } from "../../utils/helpers";

export const fetchAllAnime = createAsyncThunk(
  "anime/fetchAllAnime",
  async (_, { getState, rejectWithValue }) => {
    const lastFetchTime = getState().anime.lastFetchTimes.allAnime;
    if (lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
      return rejectWithValue("Cache is fresh, skipping fetch");
    }

    try {
      return await fetchAnimeList();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAiringAnime = createAsyncThunk(
  "anime/fetchAiringAnime",
  async (_, { getState, rejectWithValue }) => {
    const lastFetchTime = getState().anime.lastFetchTimes.airingAnime;
    if (lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
      return rejectWithValue("Cache is fresh, skipping fetch");
    }

    try {
      return await fetchAnimeList('airing');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPopularAnime = createAsyncThunk(
  "anime/fetchPopularAnime",
  async (_, { getState, rejectWithValue }) => {
    const lastFetchTime = getState().anime.lastFetchTimes.popularAnime;
    if (lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
      return rejectWithValue("Cache is fresh, skipping fetch");
    }

    try {
      return await fetchAnimeList('bypopularity');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWatchedAnime = createAsyncThunk(
  "anime/fetchWatchedAnime",
  async (userId, { rejectWithValue }) => {
    try {
      return await fetchAnimeByStatus(userId, "Watched");
    } catch (error) {
      const errorMessage = error.message ? String(error.message) : "Unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCurrWatchingAnime = createAsyncThunk(
  "anime/fetchCurrWatchingAnime",
  async (userId, { rejectWithValue }) => {
    try {
      return await fetchAnimeByStatus(userId, "Watching");
    } catch (error) {
      const errorMessage = error.message ? String(error.message) : "Unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchToWatchAnime = createAsyncThunk(
  "anime/fetchToWatchAnime",
  async (userId, { rejectWithValue }) => {
    try {
      return await fetchAnimeByStatus(userId, "Plan To Watch");
    } catch (error) {
      const errorMessage = error.message ? String(error.message) : "Unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);