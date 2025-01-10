// import { useDispatch, useSelector } from 'react-redux';
// import CartCard from '../components/cartcard/cartcard';
// import { Link } from 'react-router-dom';
// import { useEffect, useState ,useMemo} from 'react';
// import { fetchCartItems } from './fetchCartItems';
// import "./cart.css"

// export default function Cart() {
//   let dispatch = useDispatch();
//   let [cartId, setCartId] = useState(null);
//   let cart = useSelector((state) => {
//     return state.cart;
//   });
  
  
//   const totalCart = useMemo(() => {
//     return cart.reduce((acc, item) => acc + item.price , 0);
//   }, [cart]);

//   // console.log('cart', JSON.stringify(cart, null, 2));
//   async function placeOrder() {
//     let sessionKey = localStorage.getItem('sessionId');
//     let userId = localStorage.getItem('userId');
//     const response = await fetch(`http://localhost:8080/cart/${cartId}/status`,{
//       method:'PATCH',
//       credentials:'include',
//       headers:{
//         'Content-Type':'application/json',
//         sessionId:sessionKey,
//         userId:userId,
//       },
//     });
//     if(!response.ok){
//       console.log("error occured");
//     }else{
//       console.log("status updated successfully");
//     }
//   }
//   useEffect(() => {
//     let sessionKey = localStorage.getItem('sessionId');
//     let userId = localStorage.getItem('userId');
//     fetch('http://localhost:8080/cart/', {
//       method: 'GET',
//       credentials: 'include', // Include session cookies
//       headers: {
//         'Content-Type': 'application/json',
//         sessionId: sessionKey,
//         userId: userId,
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setCartId(data.id);
//         console.log('Cart entity response:', JSON.stringify(data, null, 2));
//       })
//       .catch((error) => console.error('Error fetching cart entity:', error));
//   }, []);

//   useEffect(() => {
//     if (cartId) {
//       dispatch(fetchCartItems(cartId));
//     }
//   }, [cartId, dispatch]);

//   if (cart && cart.length > 0) {
//     return (
//       <div className="cart-page">
//         <div className="cart-page1">
//           {cart.map((item) => {
//             return <CartCard cartitem={item} />;
//           })}
//         </div>
//         <div className="cart-page2">
//             <h3>Cart summary</h3>
//             <h4>Total items:{cart.reduce((acc, item) => acc + item.quantity, 0)}</h4>
//             <h4>Total amount: {totalCart}</h4>
//             <Link to='/checkoutpage'><button className="btn1">Place an Order</button></Link>
//          </div>
//       </div>
//     );
//   } else {
//     return (
//       <div>
//         <h1>Your Cart is Empty</h1>
//         <Link to={'/home'}>
//           <button className="btn1">Shop now</button>
//         </Link>
//       </div>
//     );
//   }
// }
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import CartCard from '../components/cartcard/cartcard';
import { fetchCartItems } from './fetchCartItems';
import "./cart.css";
import Modal from "../components/modal/modal"

export default function Cart() {
  const dispatch = useDispatch();
  const [cartId, setCartId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  let [isModalOpen,setIsModalOpen] = useState(false);
  let [isModalFormOpen,setIsFormModalOpen] = useState(false);
  const cart = useSelector((state) => state.cart);

  // Calculate total amount in the cart
  const totalCart = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  // Fetch cart entity details
  useEffect(() => {
    const sessionKey = localStorage.getItem('sessionId');
    const userId = localStorage.getItem('userId');
    
    fetch('http://localhost:8080/cart/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        sessionId: sessionKey,
        userId: userId,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch cart entity');
        }
        return response.json();
      })
      .then((data) => {
        setCartId(data.id);
      })
      .catch((error) => {
        console.error('Error fetching cart entity:', error);
        setErrorMessage('Unable to fetch your cart. Please try again later.');
      });
  }, []);

  // Fetch cart items when cartId is available
  useEffect(() => {
    if (cartId) {
      dispatch(fetchCartItems(cartId));
    }
  }, [cartId, dispatch]);

  // Handle place order logic
  const placeOrder = async () => {
    const sessionKey = localStorage.getItem('sessionId');
    const userId = localStorage.getItem('userId');
    
    try {
      const response = await fetch(`http://localhost:8080/cart/${cartId}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          sessionId: sessionKey,
          userId: userId,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update cart status');
      }

      console.log("Order placed successfully");
    } catch (error) {
      console.error('Error placing order:', error);
      setErrorMessage('Failed to place your order. Please try again.');
    }
  };

  // Render UI
  if (errorMessage) {
    return (
      <div className="error-message">
        <h1>{errorMessage}</h1>
        <Link to={'/home'}>
          <button className="btn1">Go to Home</button>
        </Link>
      </div>
    );
  }

  const handleOpenModal = () =>{
    console.log("clicked")
     setIsModalOpen(true);
  }

  const handleCloseModal = () => {
     setIsModalOpen(false);
  }
  
  const handleOpenFormModal = () => {
    setIsModalOpen(false)
     setIsFormModalOpen(true)
  }

  const handleCloseFormModal = () =>{
     setIsFormModalOpen(false);
  }

  if (cart && cart.length > 0) {
    return (
      <div className="cart-page">
      {/* Left Section */}
      <div className="cart-items">
        <div className='address-bar'>
          <div className='address-details'></div>
          <div className='address-btn'>
            <button className='chng-btn' onClick={handleOpenModal}>change</button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
              <h2>Modal title</h2>
              <p>contents of modal</p>
              <div>Add address <button onClick={handleOpenFormModal}>+</button></div>
            </Modal>
            <Modal isOpen={isModalFormOpen} onClose={handleCloseFormModal}>
                <h2>Form</h2>
                <p>add address</p>
            </Modal>
          </div>
        </div>
        {cart.map((item, index) => (
          // <div className="cart-item" key={index}>
          //   <img src={item.image} alt={item.name} />
          //   <div className="cart-item-details">
          //     <h4>{item.name}</h4>
          //     <p>Seller: {item.seller}</p>
          //     <p>Price: ₹{item.price}</p>
          //     <p>Quantity: {item.quantity}</p>
          //   </div>
          //   <div className="cart-item-actions">
          //     <button>Save for later</button>
          //     <button >Remove</button>
          //   </div>
          // </div>
          <CartCard cartitem={item}/>
        ))}
        
      </div>

      {/* Right Section */}
      <div className="cart-summary">
        <h3>PRICE DETAILS</h3>
        <div className="summary-line">
          <span>Price</span>
          <span>₹{0}</span>
        </div>
        <div className="summary-line">
          <span>Discount</span>
          <span>-₹{0}</span>
        </div>
        <div className="summary-line">
          <span>Delivery Charges</span>
          <span>Free</span>
        </div>
        <div className="summary-line">
          <span>Total Amount</span>
          {/* <span>₹{totalPrice - totalSavings}</span> */}
        </div>
        <Link to = '/checkoutpage'><button className="place-order-btn">Place Order</button></Link>
      </div>
    </div>
    );
  }

  return (
    <div className="empty-cart">
      <h1>Your Cart is Empty</h1>
      <Link to={'/home'}>
        <button className="btn1">Shop Now</button>
      </Link>
    </div>
  );
}
