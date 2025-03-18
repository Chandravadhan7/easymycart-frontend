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
                    return ratingResponse.json(); // Parse the rating
                  })
                  .then((ratingData) => {
                    product.rating = ratingData; // Add the rating to the product
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
                    return categoryResponse.json(); // Parse the category
                  })
                  .then((categoryData) => {
                    product.category = categoryData; // Add the category to the product
                  })
              );
            }
  
            // Wait for all promises (rating/category) to resolve and return the updated product
            return Promise.all(promises).then(() => product);
          })
        );
      })
      .then((finalProducts) => {
        console.log('Final Products with Ratings and Categories:', finalProducts);
        setProducts(finalProducts); // Set the final array to state
      })
      .catch((error) => {
        console.error('Error fetching products or ratings/categories:', error);
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
