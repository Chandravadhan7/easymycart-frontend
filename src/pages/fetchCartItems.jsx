import { useState } from "react";
import { setCart } from "../store/slices/cartSlice";

export const fetchCartItems = (cartId) => async (dispatch) => {
  try {
    const response = await fetch(`http://localhost:8080/cart/${cartId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cart items. Status: ${response.status}`);
    }

    const cartItems = await response.json();
    const productPromises = cartItems.map((item) =>
        fetch(`http://localhost:8080/product/${item.product_id}`).then((resp) =>
          resp.json()
        )
      );
  
      const cartProducts = await Promise.all(productPromises);
  
      dispatch(setCart(cartProducts));
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};
