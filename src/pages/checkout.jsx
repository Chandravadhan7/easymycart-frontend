import { useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchCartItems } from "./fetchCartItems";
import CartCard from "../components/cartcard/cartcard";

export default function Checkout(){
    let [cartId,setCartId] = useState(null);
    let dispatch = useDispatch();
    let cart = useSelector((state) => state.cart);

    async function placeOrder() {
        let sessionKey = localStorage.getItem('sessionId');
        let userId = localStorage.getItem('userId');
        const [response1,response2] = await Promise.all([fetch(`http://localhost:8080/cart/${cartId}/status`,{
          method:'PATCH',
          credentials:'include',
          headers:{
            'Content-Type':'application/json',
            sessionId:sessionKey,
            userId:userId,
          },
        }),fetch(`http://localhost:8080/order/${cartId}`,{
            method:'POST',
            credentials:'include',
          headers:{
            'Content-Type':'application/json',
            sessionId:sessionKey,
            userId:userId,
          },
        })])
        if(!response1.ok && !response2.ok){
          console.log("error occured");
        }else{
          console.log("status updated successfully");
        }
      }
    useEffect(() => {placeOrder()},[]);
    console.log(cart);
    useEffect(() => {
        let sessionKey = localStorage.getItem('sessionId');
        let userId = localStorage.getItem('userId');
        fetch('http://localhost:8080/cart/', {
          method: 'GET',
          credentials: 'include', // Include session cookies
          headers: {
            'Content-Type': 'application/json',
            sessionId: sessionKey,
            userId: userId,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setCartId(data.id);
            console.log('Cart entity response:', JSON.stringify(data, null, 2));
          })
          .catch((error) => console.error('Error fetching cart entity:', error));
      }, []);
    
      useEffect(() => {
        if (cartId) {
          dispatch(fetchCartItems(cartId));
        }
      }, [cartId, dispatch]);
    return (
      <div className="">
        <div className="cart-page1">
          {cart.map((item) => {
            return <CartCard cartitem={item} />;
          })}
            <button onClick={placeOrder} className="btn1">Place an Order</button>
        </div>
        
      </div>
    );
}