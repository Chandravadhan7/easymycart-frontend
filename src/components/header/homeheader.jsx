import './homeheader.css';
import { Link, useNavigate } from 'react-router-dom';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import Person4SharpIcon from '@mui/icons-material/Person4Sharp';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useState } from 'react';

export default function HomeHeader() {
  const [searchValue, setSearchValue] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false); // Add this state
  const navigate = useNavigate();

  const sessionId = localStorage.getItem('sessionId');
  const username = localStorage.getItem('userName');

  const logout = async () => {
    try {
      const sessionKey = localStorage.getItem('sessionId');

      const response = await fetch('http://localhost:8080/user/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          sessionId: sessionKey,
        },
      });

      if (!response.ok) {
        console.log('Session ID not found');
      }

      localStorage.removeItem('sessionId');
      localStorage.removeItem('userId');
      navigate('/login');
    } catch (err) {
      console.log('Error occurred');
    }
  };

  const handleSubmit = () => {
    if (searchValue.trim() !== '') {
      navigate(`/product?query=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Add these new handlers
  const handleSearchClick = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchClose = () => {
    setIsSearchExpanded(false);
    setSearchValue('');
  };

  return (
    <>
      {isSearchExpanded ? (
        <div className="head-expanded-search">
          <ArrowBackIcon className="back-icon" onClick={handleSearchClose} />
          <div className="searchbar-expanded">
            <SearchRoundedIcon
              className="search-icon-expanded"
              onClick={handleSubmit}
            />
            <input
              placeholder="Search for products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleEnter}
              className="bar-expanded"
              autoFocus
            />
          </div>
        </div>
      ) : (
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
          <div className="mobile-search-icon" onClick={handleSearchClick}>
            <SearchRoundedIcon />
          </div>
          <Link to="/cart" className="head-2">
            <ShoppingCartOutlinedIcon />
            <div className="entities">Cart</div>
          </Link>
          <Link to="/wishlist" className="head-2">
            <FavoriteBorderOutlinedIcon />
            <div className="entities">Wishlist</div>
          </Link>
          {sessionId ? (
            <div className="head-2-user">
              <Person2OutlinedIcon />
              <div className="entities">{'Hello, ' + username}</div>
              <KeyboardArrowDownOutlinedIcon />

              <div className="drop-down-menu">
                <div className="dropdown-user-info">
                  <div className="dropdown-user-name">{username}</div>
                  <div className="dropdown-user-email">
                    {username?.toLowerCase()}@gmail.com
                  </div>
                </div>

                <div className="drop-down-item">
                  <Link to="/profile" className="drop-down-item1">
                    <div className="drop-down-item-syb">
                      <Person4SharpIcon />
                    </div>
                    <div className="drop-down-item-text">Profile</div>
                  </Link>
                </div>

                {/* Add My Orders dropdown item */}
                <div className="drop-down-item">
                  <Link to="/orders" className="drop-down-item1">
                    <div className="drop-down-item-syb">
                      <LocalShippingIcon />
                    </div>
                    <div className="drop-down-item-text">My Orders</div>
                  </Link>
                </div>

                <div className="drop-down-item">
                  <Link to="/cart" className="drop-down-item1">
                    <div className="drop-down-item-syb">
                      <ShoppingCartOutlinedIcon />
                    </div>
                    <div className="drop-down-item-text">Cart</div>
                    <div className="dropdown-badge">3</div>
                  </Link>
                </div>

                <div className="drop-down-item">
                  <Link to="/wishlist" className="drop-down-item1">
                    <div className="drop-down-item-syb">
                      <FavoriteIcon />
                    </div>
                    <div className="drop-down-item-text">Wishlist</div>
                    <div className="dropdown-badge">5</div>
                  </Link>
                </div>

                <div className="drop-down-item logout" onClick={logout}>
                  <div className="drop-down-item1">
                    <div className="drop-down-item-syb">
                      <LogoutSharpIcon sx={{ color: '#d32f2f' }} />
                    </div>
                    <div
                      className="drop-down-item-text"
                      style={{ color: '#d32f2f' }}
                    >
                      Logout
                    </div>
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
        </div>
      )}
    </>
  );
}
