import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/productcard/productcard';
import './home.css';

export default function Category() {
  let [products, setProducts] = useState([]);
  let [category, setCategory] = useState([]);

  let param = useParams();

  useEffect(() => {
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
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the array of products
      })
      .then((productArray) => {
        // Map through the products and fetch ratings where applicable
        return Promise.all(
          productArray.map((product) => {
            if (product.rating_id) {
              // Fetch rating for products with a `rating_id`
              return fetch(
                `http://localhost:8080/product/rating/${product.rating_id}`,
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
                .then((ratingResponse) => {
                  if (!ratingResponse.ok) {
                    throw new Error(
                      `Rating HTTP error! Status: ${ratingResponse.status}`
                    );
                  }
                  return ratingResponse.json(); // Parse the rating
                })
                .then((ratingData) => {
                  // Add the rating to the product
                  return { ...product, rating: ratingData };
                });
            }
            // If no rating_id, return the product as is
            return product;
          })
        );
      })
      .then((finalProducts) => {
        console.log('Final Products with Ratings:', finalProducts);
        setProducts(finalProducts); // Set the final array to state
      })
      .catch((error) => {
        console.error('Error fetching products or ratings:', error);
      });
  }, [param.id]); 
  
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
      {/* <div className="side1">
        CATEGORIES
        {category.map((item) => {
          return (
            <div className="side11">
              <Link to={`/product/category's/${item.id}`} className='custom-link'><div>{item.title}</div></Link>
            </div>
          );
        })}
      </div> */}
      <div className="side2">
        {products.map((item) => {
          return (
            <div className="productitem">
              <Link to={`/product/${item.id}`} className='custom-link'><ProductCard product={item}  /></Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
