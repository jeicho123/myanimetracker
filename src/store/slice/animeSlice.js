import { createSlice } from '@reduxjs/toolkit';
import { fetchAllAnime, fetchWatchedAnime, fetchPopularAnime, fetchAiringAnime, fetchCurrWatchingAnime, fetchToWatchAnime } from '../thunks/animeThunks';

const initialState = {
  popularAnime: [],
  allAnime: [],
  airingAnime: [],
  watchedAnime: [],
  currWatchingAnime: [],
  toWatchAnime: [],
  lastFetchTimes: {
    popularAnime: null,
      allAnime: null,
      airingAnime: null,
    },
  loading: false,
  error: null,
};

const animeSlice = createSlice({
    name: 'anime',
    initialState,
    reducers: {
      setLoading: (state, action) => {
        state.loading = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchAllAnime.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAllAnime.fulfilled, (state, action) => {
          state.allAnime = action.payload;
          state.lastFetchTimes.allAnime = Date.now();
          state.loading = false;
        })
        .addCase(fetchAllAnime.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
        })
        .addCase(fetchPopularAnime.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchPopularAnime.fulfilled, (state, action) => {
          state.popularAnime = action.payload;
          state.lastFetchTimes.popularAnime = Date.now();
          state.loading = false;
        })
        .addCase(fetchPopularAnime.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
        })
        .addCase(fetchAiringAnime.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAiringAnime.fulfilled, (state, action) => {
          state.airingAnime = action.payload;
          state.lastFetchTimes.airingAnime = Date.now();
          state.loading = false;
        })
        .addCase(fetchAiringAnime.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
        })
        .addCase(fetchWatchedAnime.pending, (state) => {
          state.error = null;
          state.loading = true;
        })
        .addCase(fetchWatchedAnime.fulfilled, (state, action) => {
          state.watchedAnime = action.payload;
          state.loading = false;
        })
        .addCase(fetchWatchedAnime.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
        })
        .addCase(fetchCurrWatchingAnime.pending, (state) => {
          state.error = null;
          state.loading = true;
        })
        .addCase(fetchCurrWatchingAnime.fulfilled, (state, action) => {
          state.currWatchingAnime = action.payload;
          state.loading = false;
        })
        .addCase(fetchCurrWatchingAnime.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
        })
        .addCase(fetchToWatchAnime.pending, (state) => {
          state.error = null;
          state.loading = true;
        })
        .addCase(fetchToWatchAnime.fulfilled, (state, action) => {
          state.toWatchAnime = action.payload;
          state.loading = false;
        })
        .addCase(fetchToWatchAnime.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
          console.log(state.error);
        });
    },
  });

export const { setLoading } = animeSlice.actions;
export default animeSlice.reducer;