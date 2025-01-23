import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './details.css';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ProductCard from '../components/productcard/productcard';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, setWishlist } from '../store/slices/wishListSlice';
import { fetchCartItems } from './fetchCartItems';
import { fetchWishlist } from './fetchWishlistItems';
import { recentlyViewed } from './fetchRecentlyViewed';
export default function Details() {
  let [productDetails, setProductDetails] = useState(null);
  let [categoryproducts, setCategoryProducts] = useState([]);
  let [cartDetails, setCartDetails] = useState(null);
  let [wishlistDetails, setWishlistDetails] = useState(null);
  let [reviews,setReviews] = useState([]);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const scrollContainerRef1 = useRef(null);
  const scrollContainerRef2 = useRef(null);

  const scrollLeft = (ref) => {
    ref.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = (ref) => {
    ref.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  let cart = useSelector((state) => {
    return state.cart;
  });

  let wishlist = useSelector((state) => {
    return state.wishlist;
  });
  console.log(wishlist);

  let recentProducts = useSelector((state) =>{
    return state.recent;
  })
  let param = useParams();

  useEffect(() => {
    async function fetchWishlist() {
      try {
        let sessionKey = localStorage.getItem('sessionId');
        let userId = localStorage.getItem('userId');
        const response = await fetch('http://localhost:8080/wishlist/', {
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
        console.log('wishlist retrived successfully:', resp);
        setWishlistDetails(resp);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }
    fetchWishlist();
  }, [dispatch]);

  useEffect(() => {
    if (cartDetails?.id) {
      dispatch(fetchCartItems(cartDetails?.id));
    }
  }, [cartDetails?.id, dispatch]);
  useEffect(() => {
    if (wishlistDetails?.id) {
      dispatch(fetchWishlist(wishlistDetails?.id));
    }
  }, [wishlistDetails?.id, dispatch]);
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

  useEffect(() =>{
    dispatch(recentlyViewed())
  },[])
  useEffect(() => {
    let sessionKey = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    
    // Fetch product details
    fetch(`http://localhost:8080/product/${param.id}`, {
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
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((productResponse) => {
        if (productResponse.rating_id) {
          return fetch(
            `http://localhost:8080/product/rating/${productResponse.rating_id}`,
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
            .then((ratingResponse) => {
              if (!ratingResponse.ok) {
                throw new Error(`HTTP error! Status: ${ratingResponse.status}`);
              }
              return ratingResponse.json();
            })
            .then((ratingData) => ({
              ...productResponse,
              rating: ratingData,
            }));
        }
        return productResponse; // No rating_id, return product as is
      })
      .then((finalResponse) => {
        setProductDetails(finalResponse);
        console.log(finalResponse)
      })
      .catch((error) => {
        console.error('Error fetching product or rating:', error);
      });
  }, [param.id]);
  const getReviws = async () =>{
    let sessionKey = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    if(productDetails?.rating_id){
    const response  = await fetch(`http://localhost:8080/product/ratings/${productDetails?.rating_id}`,{
      method:'GET',
      headers: {
        'Content-Type': 'application/json',
        sessionId: sessionKey,
        userId: userId,
      },
    })
  
    if(!response.ok){
      console.log("error in fetching reviews");
    }
  
    const data = await response.json();
    setReviews(data);
    console.log("reviews",data);
    }
  }

  useEffect(()=>{
    getReviws();
  },[productDetails?.rating_id])

  async function handleAddToCart() {
    try {
      let sessionKey = localStorage.getItem('sessionId');
      let userId = localStorage.getItem('userId');
      if (!productDetails || !productDetails.id) {
        throw new Error('Product details are missing or invalid.');
      }

      console.log('Product ID:', productDetails.id);

      dispatch(addToCart(productDetails));

      if (!cartDetails || !cartDetails.id) {
        throw new Error('Cart details are missing or invalid.');
      }

      const cartId = cartDetails.id;

      const response = await fetch(
        `http://localhost:8080/cart/${cartId}/cartitems?product_id=${productDetails.id}&quantity=1`,
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

  async function handleAddToWishlist() {
    try {
      let sessionKey = localStorage.getItem('sessionId');
      let userId = localStorage.getItem('userId');
      if (!productDetails || !productDetails.id) {
        throw new Error('Product details are missing or invalid.');
      }

      console.log('Product ID:', productDetails.id);

      dispatch(addToWishlist(productDetails));

      if (!cartDetails || !cartDetails.id) {
        throw new Error('Cart details are missing or invalid.');
      }
      const wishlistId = wishlistDetails.id;
      const response = await fetch(
        `http://localhost:8080/wishlist/${wishlistId}/wishlistitems?productId=${productDetails.id}`,
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
      console.log('product added successfully');
    } catch (error) {}
  }

  useEffect(
    function () {
      let sessionKey = localStorage.getItem('sessionId');
      let userId = localStorage.getItem('userId');
      if (productDetails && productDetails.category_id) {
        fetch(
          `http://localhost:8080/product/category's/${productDetails?.category_id}`,
          {
            method: 'GET',
            credentials: 'include', // Include session cookies
            headers: {
              'Content-Type': 'application/json',
              sessionId: sessionKey,
              userId: userId,
            },
          },
        )
          .then((response) => {
            return response.json();
          })
          .then((productResponse) => {
            return Promise.all(
             productResponse.map((product) => {
              if(product.rating_id){
              return fetch(`http://localhost:8080/product/rating/${product.rating_id}`,{
                method: 'GET',
                credentials: 'include', // Include session cookies
                headers: {
                 'Content-Type': 'application/json',
                  sessionId: sessionKey,
                  userId: userId,
                },
              }).then((ratingResponse)=>{
                return ratingResponse.json();
              }).then((ratingResponse) => {
                return {...product,rating:ratingResponse};
              })
             }
             return product;
          })
            )
          }).then((finalResponse) => {
            console.log("categoryproducts")
            console.log(finalResponse)
            setCategoryProducts(finalResponse)
          })
      }
    },
    [productDetails],
  );

  function handleRemoveFromWishlist() {}

  const currentDate = new Date();
  const futureDate = new Date();
  futureDate.setDate(currentDate.getDate()+2);
  return (
    <div className="whole-cont">
      <div className="details">
        <div className="det1">
          <div className="imgcont">
            <img
              src={productDetails?.image}
              alt={productDetails?.title}
              className="img-size"
            />
          </div>
        </div>
        <div className="det2">
          <div className='det21'>
        <div className="ctry">Men Clothing</div>
          <div className="ttl">{productDetails?.title}</div>
          <div className="rating2">
            <div style={{ fontWeight: 'bolder' }}>{productDetails?.rating?.score}</div>
            <div><StarIcon fontSize='smaller' style={{color:'green'}}/>| {productDetails?.rating?.rate_count} Ratings</div>
          </div>
          </div>
          <div className='det22'>
          <div className="money">
            <div>₹{productDetails?.sellingPrice}</div>
            <div className='mrp'>MRP <span style={{textDecoration:'line-through'}}>₹{productDetails?.originalPrice}</span></div>
            <div style={{fontSize:'50%',color:'orange'}}>({productDetails?.discount}% OFF)</div>
            </div>
          <div className="tax">inclusive of all taxes</div>
          <div className="butns">
            <button
              onClick={() => {
                productDetails &&
                cart.some((item) => item.id === productDetails?.id)
                  ? navigate('/cart')
                  : handleAddToCart();
              }}
              className="btzn"
            >
              {cart.some((item) => item.id === productDetails?.id)
                ? 'Go To Cart'
                : 'Add To Cart'}
            </button>
            <button
              onClick={() =>
                wishlist.some((item) => item.id === productDetails?.id)
                  ? handleRemoveFromWishlist()
                  : handleAddToWishlist()
              }
              className="bottn123"
            >
              {wishlist.some((item) => item.id === productDetails?.id)
                ? 'Wishlisted'
                : 'Wishlist'}
            </button>
          </div>
          </div>
          <div className='det23'>
          <div className="mone">
            <div >₹{productDetails?.sellingPrice}</div>
            <div ><span style={{textDecoration:'line-through',color:'gray'}}>₹{productDetails?.originalPrice}</span></div>
            <div style={{color:'green'}}>({productDetails?.discount}% OFF)</div>
            </div>
            <div className='div-date'>Get it by {futureDate.toLocaleDateString("en-US",{weekday:'short',day:'2-digit',month:'short'})}</div>
          </div>
          <div className='det24'>
             <div className='det241'>
              <div style={{width:'100%',height:'33%',fontSize:'200%',textAlign:'left'}}>Ratings & Reviews</div>
              <div style={{width:'100%',height:'25%',display:'flex'}}>
                <div style={{width:'6%',fontSize:'150%',textAlign:'left'}}>{productDetails?.rating?.score}</div>
                <div style={{width:'5%',textAlign:'left'}}><StarIcon fontSize='medium'/></div>
              </div>
              <div style={{width:'100%',height:'10%',textAlign:'left',fontSize:'80%',color:'gray'}}>{productDetails?.rating?.rate_count} Ratings</div>
             </div>
             <div className='det242'>
              {reviews.map((item)=>{
                return(
                  <div className='review-card'>
                    <div style={{height:'20%',width:'6%',textAlign:'left',display:'flex',backgroundColor:'rgb(40, 164, 40)',color:'#fff',justifyContent:'center'}}><div style={{lineHeight:'100%',width:'30%'}}>{item.stars}</div> <div style={{width:'50%'}}><StarIcon fontSize='xxl-smaller'/></div></div>
                    <div style={{height:'20%',width:'95%',overflow:'hidden',textAlign:'left',fontWeight:'200'}}>{item.comment}</div>
                    <div style={{height:'20%',width:'95%',textAlign:'left',fontSize:'80%',color:'gray',display:'flex',gap:'2%'}}>
                      <div>{item.reviewerName}</div>
                      <div style={{display:'flex'}}><div style={{lineHeight:'160%'}}><CheckCircleIcon fontSize='smaller'/></div> <div>Certified Buyer</div></div>
                      <div>{new Date(item.reviewDate).toLocaleDateString("en-US",{month:'short',year:'numeric'})}</div>
                      </div>

                  </div>
                )
              })}
             </div>
          </div>
        </div>
      </div>
    
      <div className="scroll-wrapper">
      <button className="scroll-btn left" onClick={() => scrollLeft(scrollContainerRef1)}>
        &#8249;
      </button>
      <div className='sim-pro'>Similar products</div>
      <div className="samecat" ref={scrollContainerRef1}>
        {categoryproducts.map((item) => (
          <div className="procont" key={item.id}>
            <Link to={`/product/${item.id}`} className='custom-link'>
              <ProductCard product={item} />
            </Link>
          </div>
        ))}
      </div>
      <button className="scroll-btn right" onClick={() => scrollRight(scrollContainerRef1)}>
        &#8250;
      </button>
    </div>
    <div className='scroll-wrapper'>
      <button className="scroll-btn left" onClick={() => scrollLeft(scrollContainerRef2)}>
      &#8249;
      </button>
      <div className='sim-pro'>Recently Viewed products</div>
      <div className='samecat' ref={scrollContainerRef2}>
        {recentProducts.map((item) =>{
          return(
            <div className="procont" key={item.id}>
            <Link to={`/product/${item.id}`}>
              <ProductCard product={item} />
            </Link>
          </div>
          )
        })}
      </div>
      <button className="scroll-btn right" onClick={() => scrollRight(scrollContainerRef2)}>
      &#8250;
      </button>
    </div>
    </div>
  );
}
