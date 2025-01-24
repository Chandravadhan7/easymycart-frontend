import { useState } from 'react';
import { setCart } from '../store/slices/cartSlice';

export const fetchCartItems = (cartId) => async (dispatch) => {
  try {
    let sessionKey = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    const response = await fetch(`http://localhost:8080/cart/${cartId}`, {
      method: 'GET',
      credentials: 'include', // Include session cookies
      headers: {
        'Content-Type': 'application/json',
        sessionId: sessionKey,
        userId: userId,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cart items. Status: ${response.status}`);
    }

    const cartItems = await response.json();
    const productPromises = cartItems.map((item) =>
      fetch(`http://localhost:8080/product/${item.product_id}`, {
        method: 'GET',
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
          sessionId: sessionKey,
          userId: userId,
        },
      }).then((resp) => resp.json())
      .then((resp) => ({...resp,quantity:item.quantity}))
    );

    const cartProducts = await Promise.all(productPromises);

    dispatch(setCart(cartProducts));
  } catch (error) {
    console.error('Error fetching cart items:', error);
  }
};
