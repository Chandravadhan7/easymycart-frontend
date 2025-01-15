import {setAddress} from '../store/slices/addressSlice'
export const userAddress = () => async function(dispatch){
    let sessionKey = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    const response = await fetch(`http://localhost:8080/address/`,{
        method:'GET',
        headers : {
            "Content-Type": "application/json",
            sessionId : sessionKey,
            userId : userId
        }
    })
    if(!response.ok){
        console.log("unable to fetch addresses");
    }
    const data = await response.json();
    console.log(data);
    dispatch(setAddress(data));
}