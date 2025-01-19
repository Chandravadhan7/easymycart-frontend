import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/productcard/productcard";
import { Link } from "react-router-dom";

export default function Products(){
    let [products,setProducts] = useState([]);
    let query = new URLSearchParams(useLocation().search).get("query")
    
    let sessionKey = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    const getProducts = async () =>{
         return await fetch(`http://localhost:8080/product/api/search?searchValue=${encodeURIComponent(query)}`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
            }
        }).then((response) => {
            return response.json();
        }).then((productArray) => {
            return Promise.all(
                productArray.map((product) =>{
                  if(product.rating_id){
                    return fetch(`http://localhost:8080/product/rating/${product.rating_id}`,{
                        method:'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            sessionId: sessionKey,
                            userId: userId,
                          },
                    }).then((ratingResponse) => {
                        return ratingResponse.json();
                    }).then((ratingData) => {
                        return {...product,rating:ratingData}
                    });
                  }
                  return product;
                })
            )
        }).then((finalProducts) => {
            setProducts(finalProducts)
        })
    }

    useEffect(()=>{
        if(query){
        getProducts()
        }
    },[query]);
    return(
        <div className="parent">
          <div className="side2">
            {products.map((item) => {
                return(
                    <div className="productitem">
                    <Link to={`/product/${item.id}`}className="custom-link"><ProductCard product={item}/></Link>
                    </div>
                )
            })}
             </div>
        </div>
    )

}