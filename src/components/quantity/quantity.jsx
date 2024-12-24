import { useState,useEffect } from "react";

export default function Quantity({cartItem}){
  const [cartDetails, setCartDetails] = useState(null);
  const [cartId, setCartId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/cart/", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setCartId(data.id);
        console.log("Cart entity response:", JSON.stringify(data, null, 2));
      })
      .catch((error) => console.error("Error fetching cart entity:", error));
  }, []);

  useEffect(() => {
    if (cartId) {
      fetch(`http://localhost:8080/cart/${cartId}/${cartItem.id}`)
        .then((response) => response.json())
        .then((response) => {
          setCartDetails(response);
          console.log("Cart response:", JSON.stringify(response, null, 2));
        })
        .catch((error) =>
          console.error("Error fetching cart item details:", error)
        );
    }
  }, [cartId, cartItem.id]);

  async function increment() {
    try {
      const response = await fetch(
        `http://localhost:8080/cart/cartitems/${cartItem.id}/increment`,
        { method: "PATCH" }
      );
      if (response.ok) {
        setCartDetails((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
      } else {
        throw new Error("Failed to increment quantity");
      }
    } catch (err) {
      console.error("Error incrementing quantity:", err);
    }
  }

  async function decrement() {
    try {
      const response = await fetch(
        `http://localhost:8080/cart/cartitems/${cartItem.id}/decrement`,
        { method: "PATCH" }
      );
      if (response.ok) {
        setCartDetails((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
      } else {
        throw new Error("Failed to decrement quantity");
      }
    } catch (err) {
      console.error("Error decrementing quantity:", err);
    }
  }

  return (
    <div>
      {cartDetails ? (
        <div>
          <button onClick={increment} disabled={cartDetails.quantity >= 10}>
            +
          </button>
          <span>{cartDetails.quantity}</span>
          <button onClick={decrement} disabled={cartDetails.quantity <= 0}>
            -
          </button>
        </div>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
}