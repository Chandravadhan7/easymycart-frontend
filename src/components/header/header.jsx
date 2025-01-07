import './header.css';
import { Link, useNavigate } from 'react-router-dom';
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useState } from 'react';
export default function Header() {
  let navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const sessionId = localStorage.getItem("sessionId");

  return (
    <div className="head">
      <div className="head1">EasyMyCart</div>
      <div className='searchbar'>
        <input  placeholder='search' className='bar'/>
        <SearchRoundedIcon className='icon'/>
      </div>
      <Link to='/wishlist' className='custom-link'><div className="head2">
        <FavoriteBorderOutlinedIcon fontSize="large"/>
        <div className="entity">Wishlist</div>
      </div></Link>
      <Link to='/cart' className='custom-link'><div className='head2'>
        <ShoppingCartOutlinedIcon fontSize='large'/>
        <div className='entity'>cart</div>
      </div></Link>
      {sessionId ? (
        // If logged in, show username with a dropdown
        <div className="head2" onClick={toggleDropdown}>
          <AccountCircleOutlined fontSize="large" />
          <div className="entity">{}</div>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <ul>
                <li>
                  <Link to="/profile" className="dropdown-item">Profile</Link>
                </li>
                <li>
                  <Link to="/orders" className="dropdown-item">Orders</Link>
                </li>
                <li onClick={handlelogout} className="dropdown-item">Logout</li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        // If not logged in, show Login button
        <Link to="/login" className="custom-link">
          <div className="head2">
            <AccountCircleOutlined fontSize="large" />
            <div className="entity">Login</div>
          </div>
        </Link>
      )}
    </div>
  );
}
