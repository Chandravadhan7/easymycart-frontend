import "./orderCard.css"
import { Link } from "react-router-dom"
export default function OrderCard({orderItem}){
    return(
        <div className="Order-item">
           <div className="odr-img-cont">
            <img src={orderItem?.image} className="odr-img-cont1"/>
           </div>
           <div className="non-odr-img1">
           <div className="non-odr-img1-title1">{orderItem?.title}</div>
           <div className="non-odr-img1-title2">₹{orderItem?.sellingPrice}</div>
           <Link to={`/product/${orderItem?.id}`} className="non-odr-img1-title3">view product details</Link>

           </div>
           {/* <div className="non-odr-img2"></div> */}
        </div>
    )
}