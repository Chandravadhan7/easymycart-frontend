import './productcard.css';
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
      <div className="contents">
        <div>{product.title}</div>
        <div>Rs.{product.sellingPrice}</div>
      </div>
    </div>
  );
}
