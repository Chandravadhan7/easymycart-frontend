import { useDispatch } from "react-redux"
import { removeFromCart } from "../../store/slices/cartSlice";
import "./cardcard.css"
export default function CartCard({cartitem}){
    let dispatch = useDispatch();

    function handleRemoveFromCart(){
        dispatch(removeFromCart(cartitem.id));
    }
    return(
        <div className="card-cart">
         <div className="cont-imge">
           <img src={cartitem?.image} alt={cartitem?.title} className="sizing"/>
         </div>
         <div className="rate">
         {/* <span className="rating1">{cartitem.rating.rate}</span>
          <span className="count">|{cartitem.rating.count} Ratings</span> */}
          </div>
         <div className="travis">
         <button onClick={handleRemoveFromCart} className="butn2">X</button>
           <h4>{cartitem?.title}</h4>
           {/* <Quantity cartitem={cartitem} /> */}
           
           <p>${cartitem?.price}</p>
         </div>
         
         
        </div>
    )
}