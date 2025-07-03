import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './categorybar.css';
export default function CategoryBar() {
  let [category, setCategory] = useState([]);
  useEffect(function () {
    let sessionKey = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    fetch(
      'http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/product/category',
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
      .then((response) => {
        console.log(response);
        setCategory(response);
      });
  }, []);
  return (
    <div className="cat-bar">
      {category.map((item) => {
        return (
          <div
            className="cat-bar-entities"
            onClick={() => {
              window.location.reload();
            }}
          >
            <Link to={`/product/category's/${item.id}`} className="custom-link">
              {item.title}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
