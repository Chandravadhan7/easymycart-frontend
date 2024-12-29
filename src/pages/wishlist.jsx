import { useDispatch, useSelector } from 'react-redux';
import WishListCard from '../components/wishlistcard/wishlistcard';
import { useEffect, useState } from 'react';
import { fetchWishlist } from './fetchWishlistItems';

export default function Wishlist() {
  let [wishlistId, setWishlistId] = useState(null);
  let dispatch = useDispatch();
  let wishlist = useSelector((state) => state.wishlist);
  console.log(wishlist);
  useEffect(() => {
    async function fetchWishlist() {
      try {
        let sessionKey = sessionStorage.getItem('sessionId');
        let userId = sessionStorage.getItem('userId');
        const response = await fetch('http://localhost:8080/wishlist/', {
          method: 'GET',
          credentials: 'include', // Include session cookies
          headers: {
            'Content-Type': 'application/json',
            sessionId: sessionKey,
            userId: userId,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! Status: ${response.status}. Message: ${errorText}`,
          );
        }
        const resp = await response.json();
        console.log('wishlist retrived successfully:', resp);
        setWishlistId(resp.id);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }
    fetchWishlist();
  }, [dispatch]);
  useEffect(() => {
    if (wishlistId) {
      dispatch(fetchWishlist(wishlistId));
    }
  }, [wishlistId, dispatch]);

  if (wishlist && wishlist.length > 0) {
    return (
      <div className="wish">
        {wishlist.map((item) => {
          return <WishListCard wishListItem={item} />;
        })}
      </div>
    );
  } else {
    return <div>nothing to show</div>;
  }
}
