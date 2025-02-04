import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import './wishlistcard.css';
import { useEffect, useState } from 'react';
import { removeFromWishlist } from '../../store/slices/wishListSlice';
export default function WishListCard({ wishListItem }) {
  let [cartDetails, setCartDetails] = useState(null);
  let dispatch = useDispatch();
  const isOutOfStock = wishListItem?.isOutOfStock;
  useEffect(() => {
    async function fetchCart() {
      try {
        let sessionKey = localStorage.getItem('sessionId');
        let userId = localStorage.getItem('userId');
        const response = await fetch('http://localhost:8080/cart/', {
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
        console.log('Cart retrieved successfully:', resp);
        setCartDetails(resp);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }

    fetchCart();
  }, [dispatch]);

  async function handleAddToCart(product) {
    try {
      let sessionKey = localStorage.getItem('sessionId');
      let userId = localStorage.getItem('userId');
      if (!product || !product.id) {
        throw new Error('Product details are missing or invalid.');
      }

      console.log('Product ID:', product.id);

      dispatch(addToCart(product));

      const cartId = cartDetails.id;

      const response = await fetch(
        `http://localhost:8080/cart/${cartId}/cartitems?product_id=${product.id}&quantity=1`,
        {
          method: 'POST',
          credentials: 'include', // Include session cookies
          headers: {
            'Content-Type': 'application/json',
            sessionId: sessionKey,
            userId: userId,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to add to cart. Status: ${response.status}`);
      }

      console.log('Product successfully added to cart.');
    } catch (error) {
      console.error('Error adding to cart:', error.message);
    }
  }

  const handleRemoveFromWishlist = async () => {
    let sessionId = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    dispatch(removeFromWishlist(wishListItem?.id));
    const response = await fetch(
      `http://localhost:8080/wishlist/${wishListItem?.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          sessionId: sessionId,
          userId: userId,
        },
      },
    );

    const data = await response.text;
    console.log(data);
  };
  return (
    <div className={`wishcard ${isOutOfStock ? 'out-of-stock' : ''}`}>
      {/* Image Section */}
      <div className="containimage">
        <img
          src={wishListItem?.image}
          alt={wishListItem?.title}
          className="imge"
        />
        {isOutOfStock && (
          <div className="out-of-stock-overlay">OUT OF STOCK</div>
        )}
        <button
          className="remove-btn"
          onClick={() => {
            handleRemoveFromWishlist();
          }}
        >
          ✕
        </button>
      </div>

      {/* Product Details Section */}
      <div className="contents1">
        <div className="title">{wishListItem?.title}</div>
        <div className="price-section">
          <span className="prce">Rs.{wishListItem?.sellingPrice}</span>
          {wishListItem?.originalPrice && (
            <span className="original-price">
              Rs.{wishListItem?.originalPrice}
            </span>
          )}
          {wishListItem?.discount && (
            <span className="discount">({wishListItem?.discount}%OFF)</span>
          )}
        </div>
      </div>

      <button
        className="move-to-bag-btn"
        onClick={() => {
          window.location.reload();
          setTimeout(() => {
            handleRemoveFromWishlist();
            handleAddToCart(wishListItem);
          }, 31);
        }}
      >
        MOVE TO BAG
      </button>
    </div>
  );
}
