import { setRecent } from "../store/slices/recentlyVieweditems";

export const recentlyViewed = () => async (dispatch) =>{
    let sessionId = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
   const response = await fetch(`http://localhost:8080/product/recentlyViewed`,{
    method:'GET',
    headers:{
        "Content-Type":"application/json",
        sessionId:sessionId,
        userId:userId,
    },
   });

   const recentEntities = await response.json();
   const recentProductPromises = recentEntities.map((item) =>{
    console.log(item.productId)
      return fetch(`http://localhost:8080/product/${item.productId}`,{
        method:'GET',
        credentials: 'include',
        headers:{
          "Content-Type":"application/json",
           sessionId:sessionId,
           userId:userId  
        }
      }).then((resp) =>{
        return resp.json();
      })
   })

   const recentProducts = await Promise.all(recentProductPromises);
   console.log(recentProducts)
   dispatch(setRecent(recentProducts));
}