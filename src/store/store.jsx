import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice"
import wishlistReducer from "./slices/wishListSlice"
const store = configureStore({
    reducer : {
    cart : cartReducer,
    wishlist : wishlistReducer

    }
})

export default store;