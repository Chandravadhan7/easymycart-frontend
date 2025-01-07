import { useEffect, useState } from 'react';
import './home.css';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/productcard/productcard';

export default function Home() {
  let [product, setProduct] = useState([]);
  let [category, setCategory] = useState([]);
  let navigate = useNavigate();

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

 


  // useEffect(function () {
  //   let sessionKey = localStorage.getItem('sessionId');
  //   let userId = localStorage.getItem('userId');
  //   fetch('http://localhost:8080/product/category', {
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
  //       setCategory(response);
  //     });
  // }, []);
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
        <div className='cat-box'>Men's Clothing</div>
        <div className='cat-box'>Electronics</div>
        <div className='cat-box'>Women's Clothing</div>
        <div className='cat-box'>Jewellery</div>
        <div className='cat-box'></div>
        <div className='cat-box'></div>
        <div className='cat-box'></div>

      </div>
     </div>
     <div className='box3'>
      <div className='box31'>Featured Products</div>
      <div className='box32'></div>
     </div>
    </div>
  );
}
