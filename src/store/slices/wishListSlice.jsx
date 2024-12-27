import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
 
const wishlistSlice = createSlice({
    name:"wishlist",
    initialState,
    reducers:{
        addToWishlist(state,action){
            const index = state.findIndex((item) => item.id === action.payload.id);
            if(index === -1){
              state.push(action.payload);
            }
        },
        removeFromWishlist(state,action){
           return state.filter((item) => item.id !== action.payload); 
        },
        setWishlist(state,action){
           return action.payload;
        }
    }
})

export const {addToWishlist,removeFromWishlist,setWishlist} = wishlistSlice.actions;

export default wishlistSlice.reducer;