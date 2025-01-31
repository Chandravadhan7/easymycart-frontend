import './homeheader.css';
import { Link, useNavigate } from 'react-router-dom';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LocalMallSharpIcon from '@mui/icons-material/LocalMallSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import Person4SharpIcon from '@mui/icons-material/Person4Sharp';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { useEffect, useRef, useState } from 'react';

export default function HomeHeader() {
  const [searchValue, setSearchValue] = useState("");
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const sessionId = localStorage.getItem("sessionId");
  const username = localStorage.getItem("userName");

  // const toggleDropdown = () => {
  //   setIsDropdownOpen((prev) => !prev);
  // };

  const logout = async () => {
    try {
      const sessionKey = localStorage.getItem("sessionId");

      const response = await fetch('http://localhost:8080/user/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          sessionId: sessionKey,
        }
      });

      if (!response.ok) {
        console.log("Session ID not found");
      }

      localStorage.removeItem('sessionId');
      localStorage.removeItem('userId');
      navigate('/login');
    } catch (err) {
      console.log("Error occurred");
    }
  };

  // Close dropdown when clicking outside
  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsDropdownOpen(false);
  //     }
  //   }

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const handleSubmit = () => {
    if (searchValue.trim() !== "") {
      navigate(`/product?query=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="header">
      <div className="head-1">EasyMyCart</div>
      <div className="search-bar">
      <SearchRoundedIcon className="icon-star" onClick={handleSubmit} />
        <input
          placeholder="Search for Products..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleEnter}
          className="barr"
        />
      </div>

      {sessionId ? (
        <div className="head-2-user"  >
          <Person2OutlinedIcon />
          <div className="entities">{"Hello, " + username}</div>
          <KeyboardArrowDownOutlinedIcon />
          
            <div className="drop-down-menu">
              <div className="drop-down-item">
                <Link to="/profile" className="drop-down-item1">
                  <div className="drop-down-item-syb"><Person4SharpIcon /></div>
                  <div className="drop-down-item-text">Profile</div>
                </Link>
              </div>
              <div className="drop-down-item">
                <Link to="/orders" className="drop-down-item1">
                  <div className="drop-down-item-syb"><LocalMallSharpIcon /></div>
                  <div className="drop-down-item-text">Orders</div>
                </Link>
              </div>
              <div className="drop-down-item">
                <Link to="/wishlist" className="drop-down-item1">
                  <div className="drop-down-item-syb"><FavoriteIcon /></div>
                  <div className="drop-down-item-text">Wishlist</div>
                </Link>
              </div>
              <div className="drop-down-item" onClick={logout}>
                <div className="drop-down-item1">
                  <div className="drop-down-item-syb"><LogoutSharpIcon /></div>
                  <div className="drop-down-item-text">Logout</div>
                </div>
              </div>
            </div>
          
        </div>
      ) : (
        <Link to="/login" className="head-2">
          <Person2OutlinedIcon />
          <div className="entities">Login</div>
        </Link>
      )}

      <Link to="/cart" className="head-2"><ShoppingCartOutlinedIcon /><div className="entities">Cart</div></Link>
      <Link to="/wishlist" className="head-2"><FavoriteBorderOutlinedIcon /><div className="entities">Wishlist</div></Link>
    </div>
  );
}
