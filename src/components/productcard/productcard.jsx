import "./productcard.css"
export default function ProductCard({product}){
    return(
        <div className="card">
            <div className="img-cont">
              <img src={product.image} alt={product.title} className="productimg"/>
            </div>
            <div className="contents">
                <div>{product.title}</div>
                <div>Rs.{product.price}</div>
            </div>
        </div>
    )
}