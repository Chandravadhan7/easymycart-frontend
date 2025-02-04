import { useEffect, useRef, useState } from 'react';
import './home.css';
import { Link, useNavigate } from 'react-router-dom';
import {Swiper,SwiperSlide} from "swiper/react";
import {Navigation,Autoplay} from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import StarIcon from '@mui/icons-material/Star';
import { addToCart } from '../store/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartItems } from './fetchCartItems';

export default function Home() {
  let [product, setProduct] = useState([]);
  let [topProducts,setTopProducts] = useState([]);
  let [category, setCategory] = useState([]);
  let [cartDetails, setCartDetails] = useState(null);
  let dispatch = useDispatch()
  let navigate = useNavigate();
  let scrollRef1 = useRef(null);
  let scrollRef2 = useRef(null);

  const scrollLeft = (ref) =>{
    ref.current.scrollBy({left:-300,behavior:'smooth'});
  }

  const scrollRight = (ref) =>{
    ref.current.scrollBy({left:300,behavior:'smooth'});
  }

  let cart = useSelector((state) => state.cart);
  console.log(cart)
  useEffect(() => {
    if (cartDetails?.id) {
      dispatch(fetchCartItems(cartDetails?.id));
    }
  }, [cartDetails?.id, dispatch]);
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

  const fetchwithauth = async () =>{
      let sessionKey = localStorage.getItem('sessionId');
      const response  = await fetch('http://localhost:8080/user/api/validate',{
        method:'POST',
        credentials:'include',
        headers:{
          'Content-Type': 'application/json',
          sessionId: sessionKey,
        }
      })
      if(!response.ok){
        alert("session expired.Please login again");
        navigate('/login');
        localStorage.removeItem('sessionId');
        localStorage.removeItem('userId');
      }

  }
 
  useEffect(() => {
    let sessionKey = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
  
    fetch(`http://localhost:8080/product/`, {
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
      .then((productArray) => {
        return Promise.all(
          productArray.map((product) => {
            const promises = [];
  
            if (product.rating_id) {
              promises.push(
                fetch(`http://localhost:8080/product/rating/${product.rating_id}`, {
                  method: 'GET',
                  credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json',
                    sessionId: sessionKey,
                    userId: userId,
                  },
                })
                  .then((ratingResponse) => {
                    if (!ratingResponse.ok) {
                      throw new Error(
                        `Rating HTTP error! Status: ${ratingResponse.status}`
                      );
                    }
                    return ratingResponse.json(); 
                  })
                  .then((ratingData) => {
                    product.rating = ratingData; 
                  })
              );
            }
  
            if (product.category_id) {
              promises.push(
                fetch(
                  `http://localhost:8080/product/category/${product.category_id}`,
                  {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                      'Content-Type': 'application/json',
                      sessionId: sessionKey,
                      userId: userId,
                    },
                  }
                )
                  .then((categoryResponse) => {
                    if (!categoryResponse.ok) {
                      throw new Error(
                        `Category HTTP error! Status: ${categoryResponse.status}`
                      );
                    }
                    return categoryResponse.json(); 
                  })
                  .then((categoryData) => {
                    product.category = categoryData; 
                  })
              );
            }
  
            return Promise.all(promises).then(() => product);
          })
        );
      })
      .then((finalProducts) => {
        console.log('Final Products with Ratings and Categories:', finalProducts);
        setProduct(finalProducts);
      })
      .catch((error) => {
        console.error('Error fetching products or ratings/categories:', error);
      });
  }, []);
   

  const getTopProducts = () => {
    const products = product.filter((item) => item?.rating?.score > 4.8).reverse();
    setTopProducts(products);
  };
  
  useEffect(() => {
    if(product.length > 0){
    getTopProducts();
    }
  }, [product]); 
  
  useEffect(() => {
    console.log(topProducts); 
  }, [topProducts]);


  useEffect(function () {
    let sessionKey = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    fetch('http://localhost:8080/product/category', {
      method: 'GET',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
        sessionId: sessionKey,
        userId: userId,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        console.log(response);
        setCategory(response);
      });
  }, []);

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

  return (
    <div className='whole-box'>
     <div className='box1'>
        <Swiper modules={[Navigation,Autoplay]} navigation autoplay={{delay:3000,disableOnInteraction:false}} loop className='box11'>
          <SwiperSlide className='box1-img-cont'>
            <img src='https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2hvcHBpbmd8ZW58MHx8MHx8fDA%3D' className='box1-img'/>
            <img src='https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' className='box1-img'/>
            <img src='https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' className='box1-img'/>
          </SwiperSlide>
          <SwiperSlide className='box1-img-cont'>
            <img src='https://images.unsplash.com/photo-1527264935190-1401c51b5bbc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' className='box1-img'/>
            <img src='https://images.unsplash.com/photo-1517527102881-ebec4986ab1b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' className='box1-img'/>
            <img src='https://images.unsplash.com/photo-1527264935190-1401c51b5bbc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' className='box1-img'/>
          </SwiperSlide>
          <SwiperSlide className='box1-img-cont'>
            <img src='https://images.unsplash.com/photo-1651173859954-76c635fb2a0e?q=80&w=2044&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' className='box1-img'/>
            <img src='https://images.unsplash.com/photo-1546502208-81d149d52bd7?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' className='box1-img'/>
            <img src='https://images.unsplash.com/photo-1651173859954-76c635fb2a0e?q=80&w=2044&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' className='box1-img'/>

          </SwiperSlide>
        </Swiper>
     </div>
     <div className='box2'>
      <div className='box21'>
        Shop by Category
      </div>
      <div className='box22'>
      <button onClick={() => scrollLeft(scrollRef1)} className="scroll-btnn left">
        &#8249;
      </button>
      <div className="box221" ref={scrollRef1}>
      {category.map((item) => (
        <Link to={`/product/category's/${item.id}`} className="cat-box" key={item.id}>
          <div className='cat-box-image-cont'>
          <img src={item.imageUrl} alt={item.title} className='cat-box-image'/>
          <div className='cat-box-title'>{item.title}</div>
          </div>
        </Link>
      ))}
    </div>
    <button onClick={() => scrollRight(scrollRef1)} className="scroll-btnn right">
        &#8250;
      </button>
      </div>
     </div>
     <div className='box3'>
      <div className='box31'>Featured Products</div>
      <div className='box32'>
        <button onClick={() => scrollLeft(scrollRef2)} className='scroll-btnn left'>
          &#8249;
          </button>
      <div className='box321' ref={scrollRef2}>
        {topProducts.map((item) => {
            return(
              <div className='top-products-cont'>
                <div className='top-img-cont'>
                  <img src={item?.image} className='top-img'/>
                </div>
                <div className='top-pro-det'>
                   <div style={{textAlign:'left',fontSize:'130%',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{item?.title}</div>
                   <div style={{display:'flex'}}>
                    <div style={{color:'rgb(250,204,21)'}}><StarIcon /></div>
                    <div style={{color:'rgb(250,204,21)'}}><StarIcon /></div>                 
                    <div style={{color:'rgb(250,204,21)'}}><StarIcon /></div>  
                    <div style={{color:'rgb(250,204,21)'}}><StarIcon /></div>
                    <div style={{color:'rgb(250,204,21)'}}><StarIcon /></div>
                    <div style={{lineHeight:'150%',marginLeft:'3%'}}>{' '}({item?.rating?.score})</div>
                   </div>
                   <div style={{display:'flex'}}>
                    <div style={{fontSize:'140%'}}>₹{item?.sellingPrice}</div>
                    <button style={{width:'30%',marginLeft:'50%',height:'120%',backgroundColor:'rgb(34, 94, 247)',fontWeight:'500',color:'white',fontSize:'110%',cursor:'pointer',borderRadius:'0.4rem',border:'none'}} onClick={() =>{cart.some((cartitem) => cartitem.id === item.id)?navigate('/cart'):handleAddToCart(item)}}>{cart.some((cartItem) => cartItem.id === item.id) ? 'Go To Cart' : 'Add To Cart'}</button>
                   </div>
                </div>
              </div>
            )
          })}
      </div>
      <button onClick={() => scrollRight(scrollRef2)} className='scroll-btnn right'>
      &#8250;
      </button>
     </div>
     </div>
    </div>
  );
}
