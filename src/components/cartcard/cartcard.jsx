import { useDispatch } from 'react-redux';
import { removeFromCart } from '../../store/slices/cartSlice';
import './cardcard.css';
import Quantity from '../quantity/quantity';

export default function CartCard({ cartitem }) {
  let dispatch = useDispatch();

  async function handleRemoveFromCart() {
    const productId = cartitem?.id; // Ensure cartItem and id exist
    let sessionId = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    if (!productId) {
      console.error('No product ID found for removal');
      return;
    }

    // Optimistically update Redux state
    dispatch(removeFromCart(productId));

    try {
      const response = await fetch(
        `http://ec2-3-83-158-47.compute-1.amazonaws.com:8080/cart/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            sessionId: sessionId,
            userId: userId,
          },
        },
      );

      if (!response.ok) {
        // If the API call fails, revert Redux state (rollback)
        console.error(`Failed to remove product. Status: ${response.status}`);
      } else {
        console.log('Product removed successfully from the server');
      }
    } catch (error) {
      // Rollback in case of network or other errors
      console.error('Error while removing product:', error);
    }
  }

  return (
    <div className="cart-item">
      <div className="image-boxx">
        <div className="image-boox">
          <img src={cartitem.image} alt={cartitem.name} className="boox-imge" />
        </div>
        <Quantity cartItem={cartitem} />
      </div>
      <div className="cart-item-detail">
        <div className="cart-item-details1">{cartitem.title}</div>
        <div className="cart-item-details2">{cartitem.description}</div>
        <div className="cart-item-details2"></div>
        <div className="cart-item-details3">
          <div
            style={{
              fontSize: '80%',
              color: 'gray',
              textDecoration: 'line-through',
            }}
          >
            ₹{cartitem.originalPrice}
          </div>
          <div style={{ fontSize: '110%', fontWeight: 'bold' }}>
            ₹{cartitem.sellingPrice}
          </div>
          <div style={{ fontSize: '90%', color: 'green' }}>
            ({cartitem.discount}%OFF)
          </div>
        </div>
        <div className="bottuns">
          <button>SAVE TO WISHLIST</button>
          <button onClick={handleRemoveFromCart}>REMOVE</button>
        </div>
      </div>
      {/* <div className="cart-item-actions">
      <button>Save for later</button>
      <button onClick={handleRemoveFromCart}>Remove</button>
    </div> */}
    </div>
  );
}
