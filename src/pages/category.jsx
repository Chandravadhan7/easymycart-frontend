import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/productcard/productcard';
import './home.css';

export default function Category() {
  let [products, setProducts] = useState([]);
  let [category, setCategory] = useState([]);

  let param = useParams();

  useEffect(function () {
    let sessionKey = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    fetch(`http://localhost:8080/product/category's/${param.id}`, {
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
        setProducts(response);
      });
  });
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
    <div className="parent">
      <div className="side1">
        {category.map((item) => {
          return (
            <div className="side11">
              <Link to={`/product/category's/${item.id}`}>{item.title}</Link>
            </div>
          );
        })}
      </div>
      <div className="side2">
        {products.map((item) => {
          return (
            <div className="productitem">
              <Link to={`/product/${item.id}`}><ProductCard product={item}  /></Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
