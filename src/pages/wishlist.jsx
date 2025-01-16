import { useDispatch, useSelector } from 'react-redux';
import WishListCard from '../components/wishlistcard/wishlistcard';
import { useEffect, useState } from 'react';
import { fetchWishlist } from './fetchWishlistItems';
import "./wishlist.css"

export default function Wishlist() {
  let [wishlistId, setWishlistId] = useState(null);
  let dispatch = useDispatch();
  let wishlist = useSelector((state) => state.wishlist);
  console.log(wishlist);
  useEffect(() => {
    async function fetchWishlist() {
      try {
        let sessionKey = localStorage.getItem('sessionId');
        let userId = localStorage.getItem('userId');
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
      // <div className="wish">
      //   {wishlist.map((item) => {
      //     return <WishListCard wishListItem={item} />;
      //   })}
      // </div>
      <div className="wishlist-container">
      <h1 className="wishlist-title">My Wishlist<span style={{marginLeft:'1.5%',fontSize:'90%',fontWeight:'50',color:'#999999'}}>{wishlist.length+" Items"}</span></h1>
      {wishlist && wishlist.length > 0 ? (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <WishListCard key={item.id} wishListItem={item} />
          ))}
        </div>
      ) : (
        <div className="wishlist-empty">No items in your wishlist</div>
      )}
    </div>
    );
  } else {
    return <div>nothing to show</div>;
  }
}
