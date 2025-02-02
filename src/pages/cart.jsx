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
import { IoRadioButtonOn, IoRadioButtonOff } from "react-icons/io5";

export default function Cart() {
  const dispatch = useDispatch();
  const [cartId, setCartId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  let [isModalOpen,setIsModalOpen] = useState(false);
  let [selectedAddress,setSelectedAddress] = useState(null);
  const [selectAddressId, setSelectAddressId] = useState(localStorage.getItem("selectAddress"));

  
  const handleSelectAddress = (address) => {
    if (!address || !address.id) {
      console.error("Invalid address selected");
      return;
    }
    localStorage.setItem("selectAddress", address.id);
    setSelectAddressId(address.id);
    window.location.reload();
  };

  useEffect(() => {
    const savedAddressId = localStorage.getItem("selectAddress");
    if (savedAddressId) {
      setSelectAddressId(savedAddressId);
    }
  }, []);
  
  // let selectAddressId = localStorage.getItem("selectAddress");

  const getAddress = async () => {
    let sessionKey = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    const response = await fetch(`http://localhost:8080/address/${selectAddressId}`,{
      method:'GET',
      headers:{
        'Content-Type': 'application/json',
        sessionId:sessionKey,
        userId:userId
      },
    })
    if(!response.ok){
      console.log("error occured");
    }
    const data = await response.json();
    setSelectedAddress(data);
    console.log(data);
  }

  useEffect(()=>{
     getAddress();
  },[]);
  
  const cart = useSelector((state) => state.cart);
  console.log(cart)
  const addresses = useSelector((state) => state.address);
  console.log(addresses);

 
  // Calculate total amount in the cart
  const totalOriginalPrice = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.originalPrice * item.quantity, 0);
  }, [cart]);

  const totalSellingPrice = useMemo(() => {
    return cart.reduce((acc,item) => acc + item.sellingPrice * item.quantity , 0);
  },[cart])

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

  if (cart && cart.length > 0) {
    return (
      <div className="cart-page">
      {/* Left Section */}
      <div className="cart-items">
        <div className='address-bar'>
          <div className='address-details'>
            <div className='add-det'>
              <div className='add-det1'><span style={{fontFamily:'Inter, -apple-system, Helvetica, Arial, sans-serif'}}>Deliver to:</span> {selectedAddress?.fullName},{selectedAddress?.pinCode}</div>
              <div className='add-det2'>{selectedAddress?.flatNumber},{selectedAddress?.area},{selectedAddress?.village},{selectedAddress?.district},{selectedAddress?.state}</div>
            </div>
          </div>
          <div className='address-btn'>
            <button className='chng-btn' onClick={handleOpenModal}>change</button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
              <div className='location'>Select Delivary Address</div>
              <div className='addresses'>
                {/* <div className='dis'>Select a delivery location to see product availability and delivery options</div> */}
              {addresses.map((item) => {
                return(
                  <div className='add1' onClick={(e) => {e.stopPropagation();handleSelectAddress(item)}}>
                    <div style={{width:'15%',color:'rgb(10, 101, 239)'}}>
                    {Number(selectAddressId) === item.id ? <IoRadioButtonOn /> : <IoRadioButtonOff />}
                    </div>
                    <div style={{display:'flex',flexDirection:'column',textAlign:'left',gap:'50%',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>
                      <div style={{fontWeight:'bold'}}>{item.fullName} ,{item.pinCode} </div>
                      <div style={{fontSize:'80%',color:'rgb(177, 176, 176)',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{item.flatNumber} {item.area} ,{item.village} ,{item.district}</div>
                    </div>
                  </div>
                )
              })}
              </div>
              {/* <div>Add address <button onClick={handleOpenFormModal}>+</button></div> */}
              <Link to={'/addresses'} style={{textDecoration:'none',color:'rgb(10, 101, 239)',textAlign:'left',marginLeft:'10%'}}>+ Add an address</Link>
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
          <span>₹{totalOriginalPrice}</span>
        </div>
        <div className="summary-line">
          <span>Discount</span>
          <span>-₹{totalOriginalPrice-totalSellingPrice}</span>
        </div>
        <div className="summary-line">
          <span>Delivery Charges</span>
          <span>Free</span>
        </div>
        <div className="summary-line">
          <span>Total Amount</span>
          <span>₹{totalSellingPrice}</span>
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
