import { useDispatch, useSelector } from 'react-redux';
import WishListCard from '../components/wishlistcard/wishlistcard';
import { useEffect, useState } from 'react';
import { fetchWishlist } from './fetchWishlistItems';
import './wishlist.css';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const [wishlistId, setWishlistId] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);

  useEffect(() => {
    async function fetchWishlistData() {
      try {
        const sessionKey = localStorage.getItem('sessionId');
        const userId = localStorage.getItem('userId');

        const response = await fetch(
          'http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/wishlist/',
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              sessionId: sessionKey,
              userId: userId,
            },
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! Status: ${response.status}. Message: ${errorText}`,
          );
        }

        const resp = await response.json();
        setWishlistId(resp.id);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setLoading(false); // stop loading even on failure
      }
    }

    fetchWishlistData();
  }, [dispatch]);

  useEffect(() => {
    if (wishlistId) {
      dispatch(fetchWishlist(wishlistId)).finally(() => setLoading(false));
    }
  }, [wishlistId, dispatch]);

  if (loading) {
    return (
      <div className="wishlist-loading-container">
        <div className="wishlist-skeleton-grid">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="wishlist-skeleton-card">
              <div className="wishlist-skeleton-image" />
              <div className="wishlist-skeleton-line short" />
              <div className="wishlist-skeleton-line" />
            </div>
          ))}
        </div>
        <div className="wishlist-spinner-center">
          <div className="wishlist-spinner" />
          <div>Loading your wishlist...</div>
        </div>
      </div>
    );
  }

  if (wishlist && wishlist.length > 0) {
    return (
      <div className="wishlist-container">
        <h1 className="wishlist-title">
          My Wishlist
          <span
            style={{
              marginLeft: '1.5%',
              fontSize: '90%',
              fontWeight: '50',
              color: '#999999',
            }}
          >
            {wishlist.length + ' Items'}
          </span>
        </h1>
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <WishListCard key={item.id} wishListItem={item} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="empty-wishlist">
        <div className="empty-wishlist-card">
          <div className="empty-wishlist-icon">
            <span role="img" aria-label="heart">
              ❤️
            </span>
          </div>
          <h1 className="empty-wishlist-heading">Your Wishlist is Empty</h1>
          <p className="empty-wishlist-subtext">
            Discover amazing products you'll love and start adding them to your
            wishlist
          </p>
          <Link to="/">
            <button className="empty-wishlist-button">Browse Products →</button>
          </Link>
          <p className="empty-wishlist-footer">
            "Every great collection starts with the first item"
          </p>
        </div>
      </div>
    );
  }
}
