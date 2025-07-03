import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import './order.css';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export default function Order() {
  let [orders, setOrders] = useState([]);
  let [loading, setLoading] = useState(true);

  const getOrders = async function () {
    try {
      let sessionKey = localStorage.getItem('sessionId');
      let userId = localStorage.getItem('userId');
      const response = await fetch(
        `http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/order/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            sessionId: sessionKey,
            userId: userId,
          },
        },
      );

      const orderentities = await response.json();

      const orderWithProducts = await Promise.all(
        orderentities.map(async (order) => {
          const cartResponse = await fetch(
            `http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/cart/${order.cartId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                sessionId: sessionKey,
                userId: userId,
              },
            },
          );

          const cartItems = await cartResponse.json();
          const firstProductId = cartItems[0]?.product_id;

          if (firstProductId) {
            const productResponse = await fetch(
              `http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/product/${firstProductId}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  sessionId: sessionKey,
                  userId: userId,
                },
              },
            );

            const productDetails = await productResponse.json();
            return { ...order, firstProduct: productDetails };
          }
          return { ...order, firstProduct: null };
        }),
      );
      setOrders(orderWithProducts);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="order">
      {(loading || orders.length > 0) && (
        <div className="order-tile">Your Orders</div>
      )}

      <div className="orders">
        {loading ? (
          <>
            {[1, 2, 3].map((_, index) => (
              <div className="orchid skeleton-order" key={index}>
                <div className="order-child-img skeleton-box"></div>
                <div className="order-child-title">
                  <div className="skeleton-text-line short"></div>
                  <div className="skeleton-text-line"></div>
                  <div className="skeleton-text-line long"></div>
                </div>
                <div className="order-child-date">
                  <div className="skeleton-text-line short"></div>
                  <div className="skeleton-text-line"></div>
                </div>
              </div>
            ))}
          </>
        ) : orders.length === 0 ? (
          <div className="no-orders-container">
            <div className="no-orders-card">
              <div className="no-orders-icon">🛍️</div>
              <div className="no-orders-title">
                Nothing Ordered Yet – Let’s Change That!
              </div>
              <div className="no-orders-subtext">
                Discover amazing products you'll love and start ordering them
              </div>
              <Link to="/" className="browse-button">
                Order now →
              </Link>
              <div className="quote">
                "Every great collection starts with the first order"
              </div>
            </div>
          </div>
        ) : (
          orders.map((item) => (
            <Link
              to={`/orders/${item?.cartId}/${item?.addressId}`}
              className="custom-link"
              key={item?.orderId}
            >
              <div className="orchid">
                <div className="order-child-img">
                  <img src={item?.firstProduct?.image} className="image-Cont" />
                </div>
                <div className="order-child-title">
                  <div className="odr-tdp">{item?.firstProduct?.title}</div>
                  <div className="odr-tdp1">
                    {item?.firstProduct?.description}
                  </div>
                  <div className="odr-tdp">
                    Rs. {item?.firstProduct?.sellingPrice}
                  </div>
                </div>
                <div className="order-child-date">
                  <div className="odr-id">ORDER # {item?.orderId}</div>
                  <div className="odr-del">
                    <div className="del-date">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FiberManualRecordIcon
                          style={{
                            fontSize: '100%',
                            color: '#26A541',
                            marginRight: '5px',
                          }}
                        />
                        Delivered on{' '}
                        {new Date(item.deliveredOn).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          },
                        )}
                      </div>
                    </div>
                    <div className="odr-dis">your item has been delivered</div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
