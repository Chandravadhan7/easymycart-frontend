import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/productcard/productcard';
import './home.css';

export default function Category() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const param = useParams();

  useEffect(() => {
    const sessionKey = localStorage.getItem('sessionId');
    const userId = localStorage.getItem('userId');

    setLoading(true); // Start loading

    fetch(
      `http://ec2-3-83-158-47.compute-1.amazonaws.com:8080/product/category's/${param.id}`,
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
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((productArray) => {
        return Promise.all(
          productArray.map(async (product) => {
            const promises = [];

            if (product.rating_id) {
              promises.push(
                fetch(
                  `http://ec2-3-83-158-47.compute-1.amazonaws.com:8080/product/rating/${product.rating_id}`,
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
                  .then((res) => res.json())
                  .then((data) => (product.rating = data)),
              );
            }

            if (product.category_id) {
              promises.push(
                fetch(
                  `http://ec2-3-83-158-47.compute-1.amazonaws.com:8080/product/category/${product.category_id}`,
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
                  .then((res) => res.json())
                  .then((data) => (product.category = data)),
              );
            }

            await Promise.all(promises);
            return product;
          }),
        );
      })
      .then((finalProducts) => {
        setProducts(finalProducts);
        setLoading(false); // Stop loading when all done
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [param.id]);

  useEffect(() => {
    const sessionKey = localStorage.getItem('sessionId');
    const userId = localStorage.getItem('userId');

    fetch(
      'http://ec2-3-83-158-47.compute-1.amazonaws.com:8080/product/category',
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
      .then((res) => res.json())
      .then((data) => setCategory(data));
  }, []);

  return (
    <div className="parent">
      {loading ? (
        <div className="loading-wrapper">
          <div className="skeleton-grid">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="skeleton-card">
                <div className="skeleton-image" />
                <div className="skeleton-line short" />
                <div className="skeleton-line" />
              </div>
            ))}
          </div>
          <div className="spinner-center">
            <div className="spinner"></div>
            <div>Loading similar products...</div>
          </div>
        </div>
      ) : (
        <div className="side2">
          {products.map((item) => (
            <div className="productitem" key={item.id}>
              <Link to={`/product/${item.id}`} className="custom-link">
                <ProductCard product={item} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
