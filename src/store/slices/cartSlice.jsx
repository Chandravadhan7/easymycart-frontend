import { createSlice } from "@reduxjs/toolkit/react";

const initialState = [];

const cartSlice = createSlice({
    name : "cart",
    initialState,
    reducers:{
        addToCart(state,action){
          const existingItem = state.find((item) => item.id === action.payload.id);
          if(existingItem) {
            existingItem.quantity += 1;
          } else {
            state.push({...action.payload,quantity:1})
          }
        },
        removeFromCart(){

        }
    }
})
export const{addToCart} = cartSlice.actions;

export default cartSlice.reducer;