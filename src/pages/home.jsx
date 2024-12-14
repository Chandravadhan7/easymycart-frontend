import { useEffect, useState } from "react";
import "./home.css"
import { Link } from "react-router-dom";
import ProductCard from "../components/productcard/productcard";

export default function Home(){
    let [product,setProduct] = useState([]);
    let [category,setCategory] = useState([]);

    useEffect(function(){
       fetch("http://localhost:8080/product/")
       .then((response) =>{
           return response.json();
       }).then((response) => {
        console.log(response);
        setProduct(response);
       })
    },[])

    useEffect(function(){
       fetch("http://localhost:8080/product/category")
       .then((response) => {
        return response.json();
       }).then((response) => {
        console.log(response);
        setCategory(response);
       })
    },[])
    return(
        <div className="parent">
            <div className="side1">
                {category.map((item) => {
                    return(
                        <Link to= {`/product/category's/${item.id}`}><div className="side11">{item.title}</div></Link>
                    )
                }) } 
            </div>
            <div className="side2">
                
                    {product.map((item) => {
                        return(
                            <div className="productitem">
                               <Link to={`/product/${item.id}`}><ProductCard product={item}/></Link>
                            </div>
                        )
                    })}
                
            </div>
        </div>
    )
}