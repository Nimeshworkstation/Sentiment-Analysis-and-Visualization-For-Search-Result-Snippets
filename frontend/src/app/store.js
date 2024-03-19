// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import searchEngineSlice from './searchEngineSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    searchEngine:searchEngineSlice,
    // Add other reducers here if needed
  },
});

