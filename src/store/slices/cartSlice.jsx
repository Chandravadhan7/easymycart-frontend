import { createSlice } from '@reduxjs/toolkit/react';

const initialState = [];

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart(state, action) {
      return state.filter((item) => item.id !== action.payload);
    },
    setCart(state, action) {
      console.log('Payload received in setCart reducer:', action.payload);
      return action.payload;
    },
  },
});
export const { addToCart, removeFromCart, setCart } = cartSlice.actions;

export default cartSlice.reducer;
