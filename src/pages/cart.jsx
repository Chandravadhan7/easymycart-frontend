import { useDispatch, useSelector } from 'react-redux';
import CartCard from '../components/cartcard/cartcard';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchCartItems } from './fetchCartItems';

export default function Cart() {
  let dispatch = useDispatch();
  let [cartId, setCartId] = useState(null);
  let cart = useSelector((state) => {
    return state.cart;
  });
  console.log('cart', JSON.stringify(cart, null, 2));

  useEffect(() => {
    let sessionKey = sessionStorage.getItem('sessionId');
    let userId = sessionStorage.getItem('userId');
    fetch('http://localhost:8080/cart/', {
      method: 'GET',
      credentials: 'include', // Include session cookies
      headers: {
        'Content-Type': 'application/json',
        sessionId: sessionKey,
        userId: userId,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCartId(data.id);
        console.log('Cart entity response:', JSON.stringify(data, null, 2));
      })
      .catch((error) => console.error('Error fetching cart entity:', error));
  }, []);

  useEffect(() => {
    if (cartId) {
      dispatch(fetchCartItems(cartId));
    }
  }, [cartId, dispatch]);

  if (cart && cart.length > 0) {
    return (
      <div className="cart-page">
        <div className="cart-page1">
          {cart.map((item) => {
            return <CartCard cartitem={item} />;
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Your Cart is Empty</h1>
        <Link to={'/home'}>
          <button className="btn1">Shop now</button>
        </Link>
      </div>
    );
  }
}
