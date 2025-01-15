import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./order.css"
export default function Order(){
    let [orders,setOrders] = useState([]);
    const getOrders =  async function(){
        let sessionKey = localStorage.getItem("sessionId");
        let userId = localStorage.getItem("userId"); 
        const response = await fetch(`http://localhost:8080/order/`,{
            method:'GET',
            headers:{
             'Content-Type':'application/json',
             sessionId : sessionKey,
             userId : userId
            }
        })

        const orderentities = await response.json();

        const orderWithProducts = await Promise.all(
            orderentities.map(async (order) => {
                const cartResponse = await fetch(`http://localhost:8080/cart/${order.cartId}`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        sessionId: sessionKey,
                        userId: userId
                    } 
                });

                const cartItems = await cartResponse.json();
                const firstProductId = cartItems[0]?.product_id;

                if(firstProductId){
                    const productResponse = await fetch(`http://localhost:8080/product/${firstProductId}`,{
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            sessionId: sessionKey,
                            userId: userId
                        } 
                    });

                    const productDetails = await productResponse.json();
                    return{...order,firstProduct:productDetails};
                }
                return{...order,firstProduct:null};
            })
        )
        console.log(orderWithProducts);
        setOrders(orderWithProducts);
    }
    useEffect(() => {
        getOrders()
    }
    ,[]);
    return(
       <div className="order">
           <div className="order-tile">
               Your Orders
           </div>
           <div className="orders">
             {orders.map((item) =>{
                return(
                    <Link to={`/orders/${item?.cartId}`} className="custom-link">
                    <div className="orchid">
                        <div className="order-child-img">
                            <img src={item?.firstProduct?.image} className="image-Cont"/>
                        </div>
                        <div className="order-child-title">
                            <div className="odr-tdp">{item?.firstProduct?.title}</div>
                            <div className="odr-tdp1">{item?.firstProduct?.description}</div>
                            <div className="odr-tdp">Rs. {item?.firstProduct?.sellingPrice}</div>
                        </div>
                        <div className="order-child-date">
                            <div className="odr-id">ORDER # {item?.orderId}</div>
                            <div className="odr-del">
                                <div className="del-date">
                                    Delivered on {new Date(item.deliveredOn).toLocaleDateString('en-Us',{year:'numeric',month:'short',day:'numeric'})}
                                </div>
                                <div className="odr-dis">your item has been delivered</div>
                            </div>
                        </div>
                        </div>
                    </Link>
                    
                )
             })}
           </div>
       </div>
    )
}