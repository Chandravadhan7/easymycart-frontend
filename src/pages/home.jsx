import { useEffect, useRef, useState } from 'react';
import './home.css';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/productcard/productcard';

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
