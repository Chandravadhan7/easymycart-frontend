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
import {userAddress} from './fetchUserAddress';
import "./cart.css";
import Modal from "../components/modal/modal"
import CategoryBar from '../components/caterogybar/categorybar';
import { setSelectedAddress } from '../store/slices/selectAddress';

export default function Cart() {
  const dispatch = useDispatch();
  const [cartId, setCartId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  let [isModalOpen,setIsModalOpen] = useState(false);
  let [isModalFormOpen,setIsFormModalOpen] = useState(false);
  let [fullName,setFullName] = useState('');
  let [phone,setPhone] = useState('');
  let [pinCode,setPincode] = useState('');
  let [flatNumber,setFlatNumber] = useState('');
  let [area,setArea] = useState('');
  let [village,setVillage] = useState('');

  const handleSelectedAddress = (address) => {
    dispatch(setSelectedAddress(address));
  }
  
  const cart = useSelector((state) => state.cart);
  console.log(cart)
  const addresses = useSelector((state) => state.address);
  console.log(addresses);

  const select = useSelector((state) => state.selectAddress);
  useEffect(() => {
    if (select) {
      console.log("Selected Address:", select);
    }
  }, [select]);

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

  useEffect(() => {
    dispatch(userAddress());
  },[]);
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

  const inputobj = {fullName,phone,pinCode,flatNumber,area,village};
  const saveAddress = async function(){
    if(!validate()) return;
    let sessionKey = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    const response = await fetch(`http://localhost:8080/address/`,{
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
        sessionId:sessionKey,
        userId:userId
      },
      body:JSON.stringify(inputobj)
    })
    const data = await response.json();
    console.log(data);
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
 
  let isValid = true;
  const validate = () =>{
    if(!fullName){
      isValid = false;
    }
    if(!phone){
      isValid = false;
    }
    if(!pinCode){
      isValid = false;
    }
    if(!flatNumber){
      isValid = false;
    }
    if(!area){
      isValid = false;
    }
    if(!village){
      isValid = false;
    }
  }
  if (cart && cart.length > 0) {
    return (
      <div className="cart-page">
      {/* Left Section */}
      <div className="cart-items">
        <div className='address-bar'>
          <div className='address-details'>{select?.fullName}</div>
          <div className='address-btn'>
            <button className='chng-btn' onClick={handleOpenModal}>change</button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
              <div className='location'>Choose Location</div>
              <div className='addresses'>
                <div className='dis'>Select a delivery location to see product availability and delivery options</div>
              {addresses.map((item) => {
                return(
                  <div className='add1'>
                    <input
                type="radio"
                name="address"
                checked={select?.id === item.id}
                onChange={() => handleSelectedAddress(item)}
              />
                    <div>{item.fullName} ,</div>
                    <div>Door No:-{item.flatNumber} ,</div>
                    <div> {item.area} ,</div>
                    <div>{item.village} ,</div>
                    <div>{item.pinCode} </div>
                  </div>
                )
              })}
              </div>
              <div>Add address <button onClick={handleOpenFormModal}>+</button></div>
            </Modal>
            <Modal isOpen={isModalFormOpen} onClose={handleCloseFormModal} >
                <form  className='add-address'>
                  <div className='add-address1'>
                  <label>Full Name:</label>
                  <input value = {fullName} className = 'add-addressfield' placeholder='Full Name' onChange={(e) => {setFullName(e.target.value)}} required />
                  </div>
                  <div className='add-address1'>
                  <label>Phone Number:</label>
                  <input value = {phone} className = 'add-addressfield' placeholder='phone' onChange={(e) => {setPhone(e.target.value)}} required/>
                  </div>
                  <div className='add-address1'>
                  <label>Pin Code:</label>
                  <input value = {pinCode} className = 'add-addressfield' placeholder='pin code' onChange={(e) => {setPincode(e.target.value)}} required/>
                  </div>
                  <div className='add-address1'>
                  <label>Flat Number:</label>
                  <input value = {flatNumber} className = 'add-addressfield' placeholder='Flat No.' onChange={(e) => {setFlatNumber(e.target.value)}} required/>
                  </div>
                  <div className='add-address1'>
                  <label>Area/Locality:</label>
                  <input value = {area} className = 'add-addressfield' placeholder='Area' onChange={(e) => {setArea(e.target.value)}} required/>
                  </div>
                  <div className='add-address1'>
                  <label>Village/Town:</label>
                  <input value = {village} className = 'add-addressfield' placeholder='village' onChange={(e) => {setVillage(e.target.value)}} required/>
                  </div>
                  <button className='add-address-btn' onClick={saveAddress}>save address</button>
                </form>
            </Modal>
          </div>
        </div>
        <div className='cart-items-pro'>
        {cart.map((item, index) => (         
          <CartCard cartitem={item}/>
        ))}
        </div>
        
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
