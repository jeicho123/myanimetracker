import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import animeReducer from './slice/animeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    anime: animeReducer,
  },
});