import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./details.css"
import ProductCard from "../components/productcard/productcard";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";

export default function Details(){
    let [productDetails,setProductDetails] = useState(null);
    let [categoryproducts,setCategoryProducts] = useState([]);
    let [productRating,setProductRating] = useState(null);
    let dispatch = useDispatch();
    let navigate = useNavigate();

    let cart = useSelector((state) => {return state.cart});

    let param = useParams();

    function handleAddToCart(){
       dispatch(addToCart(productDetails));
    }

    useEffect(function(){
       fetch(`http://localhost:8080/product/${param.id}`)
       .then((response) => {
        return response.json();
       })
       .then((response) => {
        console.log(response);
        setProductDetails(response);
       })
    },[param.id])

    
    useEffect(function(){
        if(productDetails && productDetails.category_id){
        fetch(`http://localhost:8080/product/category's/${productDetails?.category_id}`)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            console.log(response);
            setCategoryProducts(response);
        })
    }
    },[productDetails])

    useEffect(() => {
        if (productDetails && productDetails?.rating_id) {
            fetch(`http://localhost:8080/product/rating/${productDetails?.rating_id}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((response) => {
                    console.log(response);
                    setProductRating(response);
                })
                .catch((error) => {
                    console.error("Error fetching rating:", error);
                });
        }
    }, []);

    return(
        <div>
        <div className="details">
            <div className="det1">
                <div className="imgcont">
                <img src={productDetails?.image} alt={productDetails?.title} className="img-size"/>
                </div>
               
            </div>
            <div className="det2">
                <div className="ttl">
                   {productDetails?.title}
                </div>
                <div className="rating2">
                <div style={{fontWeight:"bolder"}}>{productRating?.score}</div>
                <div>| {productRating?.rate_count} Ratings</div>
                </div>
                <div className="money">₹{productDetails?.price}</div>
             <div className="tax">inclusive of all taxes</div>
             <div className="butns">
                <button onClick={() =>{productDetails && cart.some(item => item.id === productDetails?.id) ? navigate('/cart'):handleAddToCart()}} className="btn">
                    {cart.some(item => item.id === productDetails?.id)?'Go To Cart':'Add To Cart'}
                </button>
                {/* <button onClick={() =>{wishlist.some(item => item.id === productDetails.id)?handleRemoveFromWishlist():handleAddToWishlist()}} className="btn123">
                    {wishlist.some(item => item.id === productDetails.id)?'Wishlisted':'wishlist'}</button>
            */}
            </div>
             
            </div>
        </div>
        <div className="samecat">
          {categoryproducts.map((item) => {
            return(
                <div className="procont">
                <Link to = {`/product/${item.id}`}><ProductCard product={item}/></Link>
                </div>
            )
          })}
        </div>
        </div>
    )
}