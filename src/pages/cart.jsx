import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import CartCard from '../components/cartcard/cartcard';
import { fetchCartItems } from './fetchCartItems';
import { userAddress } from './fetchUserAddress';
import './cart.css';
import Modal from '../components/modal/modal';
import { IoRadioButtonOn, IoRadioButtonOff } from 'react-icons/io5';

export default function Cart() {
  const dispatch = useDispatch();
  const [cartId, setCartId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectAddressId, setSelectAddressId] = useState(
    localStorage.getItem('selectAddress'),
  );
  const [loading, setLoading] = useState(true);

  const handleSelectAddress = (address) => {
    if (!address || !address.id) return;
    localStorage.setItem('selectAddress', address.id);
    setSelectAddressId(address.id);
    window.location.reload();
  };

  useEffect(() => {
    const savedAddressId = localStorage.getItem('selectAddress');
    if (savedAddressId) {
      setSelectAddressId(savedAddressId);
    }
  }, []);

  const getAddress = async () => {
    let sessionKey = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    const response = await fetch(
      `http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/address/${selectAddressId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          sessionId: sessionKey,
          userId: userId,
        },
      },
    );
    if (!response.ok) return;
    const data = await response.json();
    setSelectedAddress(data);
  };

  useEffect(() => {
    getAddress();
  }, []);

  const cart = useSelector((state) => state.cart);
  const addresses = useSelector((state) => state.address);

  const totalOriginalPrice = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.originalPrice * item.quantity,
      0,
    );
  }, [cart]);

  const totalSellingPrice = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.sellingPrice * item.quantity,
      0,
    );
  }, [cart]);

  useEffect(() => {
    const sessionKey = localStorage.getItem('sessionId');
    const userId = localStorage.getItem('userId');

    fetch(
      'http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/cart/',
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          sessionId: sessionKey,
          userId: userId,
        },
      },
    )
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch cart entity');
        return response.json();
      })
      .then((data) => {
        setCartId(data.id);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching cart entity:', error);
        setErrorMessage('Unable to fetch your cart. Please try again later.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (cartId) dispatch(fetchCartItems(cartId));
  }, [cartId, dispatch]);

  useEffect(() => {
    dispatch(userAddress());
  }, [dispatch]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="cart-loading-horizontal">
        {[...Array(3)].map((_, idx) => (
          <div className="cart-card-skeleton-horizontal" key={idx}>
            <div className="skeleton-img-horizontal" />
            <div className="skeleton-details">
              <div className="skeleton-line short" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line half" />
            </div>
          </div>
        ))}
        <div className="cart-spinner">
          <div className="spinner" />
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

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

  if (cart && cart.length > 0) {
    return (
      <div className="cart-page">
        <div className="cart-items">
          <div className="address-bar">
            <div className="address-details">
              <div className="add-det">
                <div className="add-det1">
                  <span
                    style={{
                      fontFamily:
                        'Inter, -apple-system, Helvetica, Arial, sans-serif',
                    }}
                  >
                    Deliver to:
                  </span>{' '}
                  {selectedAddress?.fullName && selectedAddress?.pinCode
                    ? `${selectedAddress.fullName}, ${selectedAddress.pinCode}`
                    : 'No address selected'}
                </div>
                <div className="add-det2">
                  {selectedAddress?.flatNumber
                    ? `${selectedAddress.flatNumber}, ${selectedAddress.area}, ${selectedAddress.village}, ${selectedAddress.district}, ${selectedAddress.state}`
                    : ''}
                </div>
              </div>
            </div>
            <div className="address-btn">
              <button className="chng-btn" onClick={handleOpenModal}>
                change
              </button>
              <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className="location">Select Delivery Address</div>
                <div className="addresses">
                  {addresses.map((item) => (
                    <div
                      className="add1"
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAddress(item);
                      }}
                    >
                      <div style={{ width: '15%', color: 'rgb(10, 101, 239)' }}>
                        {Number(selectAddressId) === item.id ? (
                          <IoRadioButtonOn />
                        ) : (
                          <IoRadioButtonOff />
                        )}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          textAlign: 'left',
                          gap: '50%',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>
                          {item.fullName}, {item.pinCode}
                        </div>
                        <div
                          style={{
                            fontSize: '80%',
                            color: 'rgb(177, 176, 176)',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.flatNumber} {item.area}, {item.village},{' '}
                          {item.district}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to={'/addresses'}
                  style={{
                    textDecoration: 'none',
                    color: 'rgb(10, 101, 239)',
                    textAlign: 'left',
                    marginLeft: '10%',
                  }}
                >
                  + Add an address
                </Link>
              </Modal>
            </div>
          </div>
          <div className="cart-items-pro">
            {cart.map((item, index) => (
              <CartCard key={index} cartitem={item} />
            ))}
          </div>
        </div>

        <div className="cart-summary">
          <h3>PRICE DETAILS</h3>
          <div className="summary-line">
            <span>Price</span>
            <span>₹{totalOriginalPrice}</span>
          </div>
          <div className="summary-line">
            <span>Discount</span>
            <span>-₹{totalOriginalPrice - totalSellingPrice}</span>
          </div>
          <div className="summary-line">
            <span>Delivery Charges</span>
            <span>Free</span>
          </div>
          <div className="summary-line">
            <span>Total Amount</span>
            <span>₹{totalSellingPrice}</span>
          </div>
          <button
            className="place-order-btn"
            onClick={() => {
              if (!selectedAddress || !selectedAddress.id) {
                alert('Please select an address');
              } else {
                window.location.href = '/checkoutpage';
              }
            }}
          >
            Place Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="empty-cart">
      <div className="empty-cart-icon" aria-label="empty cart" role="img">
        🛒✨
      </div>
      <div className="empty-cart-heading">Your Cart is Empty</div>
      <div className="empty-cart-subtext">
        Discover amazing products you'll love and add them to your cart!
      </div>
      <Link to="/">
        <button className="empty-cart-button">Browse Products →</button>
      </Link>
    </div>
  );
}
