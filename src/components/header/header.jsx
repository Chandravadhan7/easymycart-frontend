import "./header.css"
import { Link } from "react-router-dom"
export default function Header(){
    return(
        <div className="head">
            <div className="head1">
                EasyMyCart
            </div>
            <div className="head2">
                <div className="entity"><Link to = {`/`}>Home</Link></div>
                <div className="entity"><Link to = {`/cart`}>Cart</Link></div>
                <div className="entity"><Link to = {`/wishlist`}>WishList</Link></div>
                <div className="entity">Reviews</div>
            </div>
            <div className="head3">
            <div className="entity">Profile</div>
            </div>
        </div>
    )
}