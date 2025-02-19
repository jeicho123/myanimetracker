import { createSlice } from '@reduxjs/toolkit';
import { fetchPopularAnime, fetchWatchedAnime } from '../thunks/animeThunks';

const initialState = {
  popularAnime: [],
  allAnime: [],
  watchedAnime: [],
  lastFetchTimes: {
    popularAnime: null,
    allAnime: null,
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
        .addCase(fetchPopularAnime.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchPopularAnime.fulfilled, (state, action) => {
          state.popularAnime = action.payload;
          state.lastFetchTimes.popularAnime = Date.now();
          state.loading = false;
          console.log("fetchedpopular")
        })
        .addCase(fetchPopularAnime.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
        })
        .addCase(fetchWatchedAnime.pending, (state) => {
          state.error = null;
          state.loading = true;
          console.log("fetchingwatched")
        })
        .addCase(fetchWatchedAnime.fulfilled, (state, action) => {
          state.watchedAnime = action.payload;
          state.loading = false;
          console.log("fetchedwatched")
        })
        .addCase(fetchWatchedAnime.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
          console.log("rejectedwatched")
          console.log(state.error)
        });
      },
  });

export const { setLoading } = animeSlice.actions;
export default animeSlice.reducer;