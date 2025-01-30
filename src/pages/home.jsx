import { useEffect, useRef, useState } from 'react';
import './home.css';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/productcard/productcard';
import {Swiper,SwiperSlide} from "swiper/react";
import {Navigation,Autoplay} from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import CategoryBar from '../components/caterogybar/categorybar';
import Header from '../components/header/header';
export default function Home() {
  let [product, setProduct] = useState([]);
  let [category, setCategory] = useState([]);
  let navigate = useNavigate();
  let scrollRef1 = useRef(null);
  let scrollRef2 = useRef(null);

  const scrollLeft = (ref) =>{
    ref.current.scrollBy({left:-300,behavior:'smooth'});
  }

  const scrollRight = (ref) =>{
    ref.current.scrollBy({left:300,behavior:'smooth'});
  }

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
  // useEffect(()=>{
  //   fetchwithauth();
  // },[])
  // useEffect(function () {
  //   let sessionKey = localStorage.getItem('sessionId');
  //   let userId = localStorage.getItem('userId');
  //   fetch('http://localhost:8080/product/', {
  //     method: 'GET',
  //     credentials: 'include', // Include session cookies
  //     headers: {
  //       'Content-Type': 'application/json',
  //       sessionId: sessionKey,
  //       userId: userId,
  //     },
  //   })
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((response) => {
  //       console.log(response);
  //       setProduct(response);
  //     });
  // }, []);

 


  useEffect(function () {
    let sessionKey = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    fetch('http://localhost:8080/product/category', {
      method: 'GET',
      credentials: 'include', // Include session cookies
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
  return (
    // <div className="parent">
    //   <div className="side1">
    //     {category.map((item) => {
    //       return (
    //         <Link to={`/product/category's/${item.id}`} className='custom-link'>
    //           <div className="side11">{item.title}</div>
    //         </Link>
    //       );
    //     })}
    //   </div>
    //   <div className="side2">
    //     {product.map((item) => {
    //       return (
    //         <div className="productitem">
    //           <Link to={`/product/${item.id}`} className='custom-link'>
    //             <ProductCard product={item} />
    //           </Link>
    //         </div>
    //       );
    //     })}
    //   </div>
    // </div>
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
        <div className='fet-box'></div>
        <div className='fet-box'></div>
        <div className='fet-box'></div>
        <div className='fet-box'></div>
      </div>
      <button onClick={() => scrollRight(scrollRef2)} className='scroll-btnn right'>
      &#8250;
      </button>
     </div>
     </div>
    </div>
  );
}
