import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CartCard from "../components/cartcard/cartcard";

export default function OrderDetails(){
    let [orders,setOrders] = useState([]);
     
    const {cartId} = useParams();
    let sessionKey = localStorage.getItem("sessionId");
    let userId = localStorage.getItem("userId");
    const getOrderItem = async function(){
        const response = await fetch(`http://localhost:8080/cart/${cartId}`,{
            method:'GET',
            headers:{
               'Content-Type': 'application/json',
               sessionId: sessionKey,
               userId: userId, 
            }
        })

        const cartItems = await response.json();

        const orderProductsPromise = cartItems.map((item) =>
           fetch(`http://localhost:8080/product/${item.product_id}`,{
            method:'GET',
            headers:{
               'Content-Type': 'application/json',
               sessionId: sessionKey,
               userId: userId, 
            }
           }).then((res) => {
            return res.json();
        })
        )
        const orderProducts = await Promise.all(orderProductsPromise);
        setOrders(orderProducts);
        console.log(orderProducts);
    }

    useEffect(()=>{
        getOrderItem()
    },[]);
    return(
        <div>
            <h1>Order Details for Cart ID: {cartId}</h1>
            {orders.map((item) => {
                return(
                    <CartCard cartitem={item}/>
                )
            })}
        </div>
    )
   
}