import { configureStore } from '@reduxjs/toolkit';
// Import slices
import authReducer from './slices/authSlice';
// import booksReducer from './slices/booksSlice';
// import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    // Thêm slices ở đây
    auth: authReducer,
    // books: booksReducer,
    // cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;