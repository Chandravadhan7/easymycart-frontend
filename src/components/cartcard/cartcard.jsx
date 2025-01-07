import { useDispatch } from 'react-redux';
import { removeFromCart } from '../../store/slices/cartSlice';
import './cardcard.css';
import Quantity from '../quantity/quantity';

export default function CartCard({ cartitem }) {
  let dispatch = useDispatch();

  async function handleRemoveFromCart() {
    const productId = cartitem.id;

    dispatch(removeFromCart(productId));

    try {
      const response = await fetch(`http://localhost:8080/cart/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        console.log('Product removed successfully');
      } else {
        console.error('Failed to remove product from cart');
      }
    } catch (error) {
      console.error('Error while removing product:', error);
    }
  }

  return (
    // <div className="card-cart">
    //   <div className="cont-imge">
    //     <img src={cartitem?.image} alt={cartitem?.title} className="sizing" />
    //   </div>
    //   <div className="rate">
    //     {/* <span className="rating1">{cartitem.rating.rate}</span>
    //       <span className="count">|{cartitem.rating.count} Ratings</span> */}
    //   </div>
    //   <div className="travis">
    //     <button onClick={handleRemoveFromCart} className="butn2">
    //       X
    //     </button>
    //     <h4>{cartitem?.title}</h4>
    //     <Quantity cartItem={cartitem} />

    //     <p>${cartitem?.price}</p>
    //   </div>
    // </div>
    <div className="cart-item" >
    <img src={cartitem.image} alt={cartitem.name} />
    <div className="cart-item-details">
      <h4>{cartitem.title}</h4>
      <p>Price: ₹{cartitem.price}</p>
      {/* <p>Quantity: {cartitem.quantity}</p> */}
      <Quantity cartItem={cartitem}/>
    </div>
    <div className="cart-item-actions">
      <button>Save for later</button>
      <button onClick={handleRemoveFromCart}>Remove</button>
    </div>
  </div>
  );
}
