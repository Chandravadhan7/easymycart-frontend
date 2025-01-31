import './header.css';
import { Link, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LocalMallSharpIcon from '@mui/icons-material/LocalMallSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import Person4SharpIcon from '@mui/icons-material/Person4Sharp';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

import { useEffect, useRef, useState } from 'react';
export default function Header() {
  let [searchValue,setSearchValue] = useState("");
  console.log(searchValue);
  let navigate = useNavigate();
 const logout = async () =>{
    try{
      const sessionKey = localStorage.getItem("sessionId");
      
      const response  = await fetch('http://localhost:8080/user/api/logout',{
        method:'POST',
        credentials:'include',
        headers:{
          'Content-Type': 'application/json',
          sessionId: sessionKey,
        }
      })

      if(!response.ok){
        console.log("session id not found");
      }
      localStorage.removeItem('sessionId');
      localStorage.removeItem('userId');
      navigate('/login')
    }catch(err){
       console.log("error occured");
    }
  }

  function handlelogout(){
    logout();
  }
 
  const sessionId = localStorage.getItem("sessionId");
  const username = localStorage.getItem("userName");

  const handleSubmit = () => {
    if(searchValue.trim() !== ""){
      navigate(`/product?query=${encodeURIComponent(searchValue)}`)
    }
  }

  const handleEnter = (e) => {
    if(e.key === 'Enter'){
      handleSubmit();
    }
  };

   

  return (
    <div className="head">
      <div className="head1">EasyMyCart</div>
      <div className='searchbar'>
        <SearchRoundedIcon className='icon' />
        <input  placeholder='Search For Products...' value={searchValue} onChange={(e)=>{setSearchValue(e.target.value)}} onKeyDown={(e) =>{handleEnter(e)}} className='bar'/>
      </div>
      {sessionId ? (
        // If logged in, show username with a dropdown
        <div className="head2-user">
          <div><PersonIcon /></div>
          <div className="entity" >{"Hello,"+username}</div>
          <KeyboardArrowDownOutlinedIcon />
          
            <div className="dropdown-menu">
                <div className='dropdown-item'>
                  <Link to="/profile" className='dropdown-item1'>
                  <div className='dropdown-item-syb'><Person4SharpIcon/></div>
                  <div className='dropdown-item-text'>Profile</div>
                  </Link>
                </div> 
                <div className='dropdown-item'>
                  <Link to="/orders" className='dropdown-item1'>
                  <div className='dropdown-item-syb'><LocalMallSharpIcon/></div>
                  <div className='dropdown-item-text'>Orders</div>
                  </Link>
                </div>
                <div className='dropdown-item'>
                  <Link to="/wishlist" className='dropdown-item1'>
                  <div className='dropdown-item-syb'><FavoriteIcon /></div>
                  <div className='dropdown-item-text'>Wishlist</div>
                  </Link>
                </div> 
                <div className='dropdown-item' onClick={handlelogout}>
                  <div className='dropdown-item1'>
                  <div className='dropdown-item-syb'><LogoutSharpIcon/></div>
                  <div className='dropdown-item-text'>Logout</div>
                </div>
                </div>
            </div>
        </div>
      ) : (
        // If not logged in, show Login button
        <Link to="/login" className="custom-link">
          <div className="head2">
            <PersonIcon fontSize="large" />
            <div className="entity">Login</div>
          </div>
        </Link>
      )}
       <Link to='/cart' className='head2'>
      <div><ShoppingCartIcon /></div>
        <div className='entity'>cart</div>
      </Link>
      <Link to='/wishlist' className='head2'>
        <FavoriteIcon />
        <div className="entity">wishlist</div>
      </Link>    
    </div>
  );
}
