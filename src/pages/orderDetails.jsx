import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CartCard from "../components/cartcard/cartcard";
import "./orderDetails.css"
import OrderCard from "../components/orderCard/orderCard";
export default function OrderDetails(){
    let [orders,setOrders] = useState([]);
    let [address,setAddress] = useState(null);
     
    const {cartId} = useParams();
    const {addressId} = useParams();
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

    const getAddress = async () => {
        let sessionId = localStorage.getItem("sessionId");
        let userId = localStorage.getItem("userId");
        const  response = await fetch(`http://localhost:8080/address/${addressId}`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                sessionId:sessionId,
                userId:userId
            }
        })
        if(!response.ok){
            console.log("{error occured");
        }
        const data = await response.json();
        setAddress(data);
        console.log(data)
    }
    useEffect(()=>{
        getAddress();
    },[])
    return(
        <div className="total-cont">
            <div className="pro-orders">
            <div className="item-title">
               <div style={{height:'65%',backgroundColor:'#fff',fontSize:'180%',textAlign:'left',lineHeight:'200%',textTransform:'capitalize',boxShadow:'0 2px 4px 0 rgba(0, 0, 0, .08)',paddingLeft:'2%'}}>Items in This Order</div>
            </div>
            {orders.map((item) => {
                return(
                   <OrderCard orderItem={item}/> 
                )
            })}
            </div>
            <div className="del-address">
                <div className="del-address1">
                    <div className="del-address11"></div>
                    <div className="del-address11">Delivery Address</div>
                    <div className="del-address11">{address?.fullName}</div>
                    <div className="del-address12">{address?.flatNumber} {address?.area}, {address?.village},{address?.district}, {address?.landMark} , {address?.village} - {address?.pinCode} ,  {address?.state}</div>
                    <div className="del-address13"><span style={{fontWeight:'550'}}>Phone number</span> {address?.phone}</div>
                </div>
            </div>
        </div>
    )
   
}