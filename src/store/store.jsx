import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishListSlice';
import addressReducer from './slices/addressSlice';
import recentReducer from './slices/recentlyVieweditems'
const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    address: addressReducer,
    recent: recentReducer,
  },
});

export default store;
