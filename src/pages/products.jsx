import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/productcard/productcard';
import { Link } from 'react-router-dom';

export default function Products() {
  let [products, setProducts] = useState([]);
  let query = new URLSearchParams(useLocation().search).get('query');

  let sessionKey = localStorage.getItem('sessionId');
  let userId = localStorage.getItem('userId');
  const getProducts = async () => {
    try {
      const response = await fetch(
        `http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/product/api/search?searchValue=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const productArray = await response.json();

      const finalProducts = await Promise.all(
        productArray.map(async (product) => {
          let updatedProduct = { ...product };

          if (product.rating_id) {
            const ratingResponse = await fetch(
              `http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/product/rating/${product.rating_id}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  sessionId: sessionKey,
                  userId: userId,
                },
              },
            );
            const ratingData = await ratingResponse.json();
            updatedProduct = { ...updatedProduct, rating: ratingData };
          }

          if (product.category_id) {
            const categoryResponse = await fetch(
              `http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/product/category/${product.category_id}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  sessionId: sessionKey,
                  userId: userId,
                },
              },
            );
            const categoryData = await categoryResponse.json();
            updatedProduct = { ...updatedProduct, category: categoryData };
          }

          return updatedProduct;
        }),
      );

      setProducts(finalProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    if (query) {
      getProducts();
    }
  }, [query]);
  return (
    <div className="parent">
      <div className="side2">
        {products.map((item) => {
          return (
            <div className="productitem">
              <Link to={`/product/${item.id}`} className="custom-link">
                <ProductCard product={item} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
