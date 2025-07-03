import CartCard from '../components/cartcard/cartcard';
import { useDispatch, useSelector } from 'react-redux';
import './checkout.css';
import { useEffect, useMemo, useState } from 'react';
import { fetchCartItems } from './fetchCartItems';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Modal from '../components/modal/modal';
import { Link, useNavigate } from 'react-router-dom';
import { IoRadioButtonOn, IoRadioButtonOff } from 'react-icons/io5';
import { userAddress } from './fetchUserAddress';
import DoneIcon from '@mui/icons-material/Done';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cartId, setCartId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectAddressId, setSelectAddressId] = useState(
    localStorage.getItem('selectAddress'),
  );
  const sessionId = localStorage.getItem('sessionId');
  const userId = localStorage.getItem('userId');

  const [errorMessage, setErrorMessage] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleSelectAddress = (address) => {
    if (!address || !address.id) return;
    localStorage.setItem('selectAddress', address.id);
    setSelectAddressId(address.id);
    window.location.reload();
  };

  useEffect(() => {
    const savedAddressId = localStorage.getItem('selectAddress');
    if (savedAddressId) setSelectAddressId(savedAddressId);
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
          sessionId,
          userId,
        },
      },
    );
    if (response.ok) {
      const data = await response.json();
      setSelectedAddress(data);
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

  const username = localStorage.getItem('userName');
  const cart = useSelector((state) => state.cart);

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
          sessionId,
          userId,
        },
      },
    )
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch cart entity');
        return response.json();
      })
      .then((data) => setCartId(data.id))
      .catch((error) => {
        setErrorMessage('Unable to fetch your cart. Please try again later.');
      });
  }, []);

  async function placeOrder() {
    try {
      setIsPlacingOrder(true);
      let sessionKey = localStorage.getItem('sessionId');
      let userId = localStorage.getItem('userId');
      const [response1, response2] = await Promise.all([
        fetch(
          `http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/cart/${cartId}/status`,
          {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              sessionId,
              userId,
            },
          },
        ),
        fetch(
          `http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/order/${cartId}?address_id=${selectAddressId}`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              sessionId,
              userId,
            },
          },
        ),
      ]);
      if (response1.ok && response2.ok) {
        alert('Order placed successfully!');
        localStorage.removeItem('selectAddress');
        navigate('/orders');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      alert('Something went wrong. Please try again later.');
    } finally {
      setIsPlacingOrder(false);
    }
  }

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

  const addresses = useSelector((state) => state.address);

  useEffect(() => {
    dispatch(userAddress());
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (cartId) {
      dispatch(fetchCartItems(cartId));
    }
  }, [cartId, dispatch]);

  return (
    <div className="check-out-parent">
      <div className="check-out-cont">
        <div className="login-check">
          <div
            style={{
              width: '8%',
              paddingTop: '1.6%',
              color: 'rgb(203, 203, 203)',
            }}
          >
            <LooksOneIcon style={{ fontSize: '180%' }} />
          </div>
          <div
            style={{
              width: '70%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                height: '40%',
                textAlign: 'left',
                fontSize: '110%',
                color: 'gray',
                display: 'flex',
              }}
            >
              <div style={{ lineHeight: '150%' }}>LOGIN</div>
              <div style={{ lineHeight: '10%', color: '#8e44ec ' }}>
                <DoneIcon style={{ fontSize: '120%' }} />
              </div>
            </div>
            <div
              style={{
                height: '30%',
                textTransform: 'capitalize',
                textAlign: 'left',
                fontWeight: '550',
              }}
            >
              {username}{' '}
              <span style={{ fontWeight: '200', fontSize: '80%' }}>
                +91{selectedAddress?.phone}
              </span>
            </div>
          </div>
        </div>

        <div className="check-address">
          <div
            style={{
              width: '8%',
              paddingTop: '2%',
              color: 'rgb(203, 203, 203)',
            }}
          >
            <LooksTwoIcon style={{ fontSize: '180%' }} />
          </div>
          <div
            style={{
              width: '65%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                height: '30%',
                textAlign: 'left',
                fontSize: '110%',
                color: 'gray',
                display: 'flex',
              }}
            >
              <div style={{ lineHeight: '150%' }}>DELIVERY ADDRESS</div>
              <div style={{ lineHeight: '10%', color: '#8e44ec ' }}>
                <DoneIcon style={{ fontSize: '120%' }} />
              </div>
            </div>
            <div className="check-add">
              {selectedAddress && selectedAddress.fullName ? (
                <>
                  <span style={{ fontSize: '120%', fontWeight: '550' }}>
                    {selectedAddress.fullName}
                  </span>{' '}
                  {selectedAddress.flatNumber}, {selectedAddress.area},{' '}
                  {selectedAddress.village}, {selectedAddress.district},{' '}
                  {selectedAddress.state} -{' '}
                  <span style={{ fontSize: '120%', fontWeight: '550' }}>
                    {selectedAddress.pinCode}
                  </span>
                </>
              ) : (
                <span style={{ color: 'gray' }}>No address selected</span>
              )}
            </div>
          </div>
          <div
            style={{
              width: '20%',
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
            }}
          >
            <button className="chnge-btn" onClick={handleOpenModal}>
              change
            </button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
              <div className="location">Select Delivary Address</div>
              <div className="addresses">
                {addresses.map((item) => (
                  <div
                    key={item.id}
                    className="add1"
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
                        {item.fullName} ,{item.pinCode}
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
                        {item.flatNumber} {item.area} ,{item.village} ,
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

        <div className="checkout-pro">
          <div
            style={{
              height: '2.5rem',
              display: 'flex',
              backgroundColor: '#8e44ec ',
              color: 'white',
            }}
          >
            <div style={{ width: '8%', paddingTop: '1%' }}>
              <Looks3Icon style={{ fontSize: '150%' }} />
            </div>
            <div style={{ lineHeight: '250%', fontWeight: '300' }}>
              ORDER SUMMARY
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {cart.map((item) => (
              <CartCard cartitem={item} key={item.id} />
            ))}
          </div>
        </div>
      </div>

      <div className="checkout-sum">
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
          onClick={placeOrder}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder ? 'Placing Order...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
