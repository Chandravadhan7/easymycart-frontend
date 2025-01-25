import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { userAddress } from "./fetchUserAddress";
export default function Addresses(){
    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(userAddress())
    },[])
    const address = useSelector((state) => state.address);
    console.log(address);
    return(
        <Link to={'/add-address'}>address</Link>
    )
}