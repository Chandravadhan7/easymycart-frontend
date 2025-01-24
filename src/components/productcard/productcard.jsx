import './productcard.css';
import StarIcon from '@mui/icons-material/Star';
export default function ProductCard({ product }) {
   async function addRecents(){
    let sessionKey = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    const response = await fetch(`http://localhost:8080/product/recent?product_id=${product.id}`,{
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
        sessionId : sessionKey,
        userId : userId
      }
    })
    if(!response.ok){
      console.log("product not added")
    }
    console.log("product added")
   }
  return (
    <div className="card" onClick={(e) => {e.stopPropagation();addRecents();}}>
      <div className="img-cont">
        <img src={product.image} alt={product.title} className="productimg" />
      </div>
      <div className="rating21">
        <div style={{fontWeight:"bolder"}}>{product?.rating?.score}</div>
        <div><StarIcon fontSize='smaller' style={{color:'green'}}/>| {product?.rating?.rate_count} </div>
      </div>
      <div className="contents">
        <div className='cat'>{product?.category?.title}</div>
        <div className='name'>{product.title}</div>
        <div className='prce'>
          <div>Rs.{product.sellingPrice}</div>
          <div className='original'>Rs.{product.originalPrice}</div>
          <div className='disc'>({product.discount}% OFF)</div>
        </div>
      </div>
    </div>
  );
}
