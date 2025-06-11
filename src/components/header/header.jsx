import './header.css';
import { Link, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import Person4SharpIcon from '@mui/icons-material/Person4Sharp';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';

export default function Header() {
  const [searchValue, setSearchValue] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const navigate = useNavigate();

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
        console.log('session id not found');
      }
      localStorage.removeItem('sessionId');
      localStorage.removeItem('userId');
      navigate('/login');
    } catch (err) {
      console.log('error occurred');
    }
  };

  const handleSubmit = () => {
    if (searchValue.trim() !== '') {
      navigate(`/product?query=${encodeURIComponent(searchValue)}`);
      setIsSearchExpanded(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchClose = () => {
    setIsSearchExpanded(false);
    setSearchValue('');
  };

  const sessionId = localStorage.getItem('sessionId');
  const username = localStorage.getItem('userName');

  return (
    <>
      {isSearchExpanded ? (
        <div className="head-expanded-search">
          <ArrowBackIcon className="back-icon" onClick={handleSearchClose} />
          <div className="searchbar-expanded">
            <SearchRoundedIcon className="search-icon-expanded" onClick={handleSubmit} />
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
        <div className="head">
          <div className="head1">EasyMyCart</div>

          <div className="searchbar">
            <SearchRoundedIcon className="icon" onClick={handleSubmit} />
            <input
              placeholder="Search For Products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleEnter}
              className="bar"
            />
          </div>

          <div className="mobile-search-icon" onClick={handleSearchClick}>
            <SearchRoundedIcon />
          </div>

          <Link to="/cart" className="head2">
            <ShoppingCartIcon />
            <div className="entity">cart</div>
          </Link>

          <Link to="/wishlist" className="head2">
            <FavoriteIcon />
            <div className="entity">wishlist</div>
          </Link>

          {sessionId ? (
            <div className="head2-user">
              <PersonIcon />
              <div className="entity">{`Hello, ${username}`}</div>
              <KeyboardArrowDownOutlinedIcon />

              <div className="dropdown-menu">
                <div className="dropdown-user-info">
                  <div className="dropdown-user-name">{username || 'John Doe'}</div>
                  <div className="dropdown-user-email">
                    {username
                      ? `${username.toLowerCase()}@example.com`
                      : 'john.doe@example.com'}
                  </div>
                </div>

                <div className="dropdown-item">
                  <Link to="/profile" className="dropdown-item1">
                    <div className="dropdown-item-syb">
                      <Person4SharpIcon />
                    </div>
                    <div className="dropdown-item-text">Profile</div>
                  </Link>
                </div>

                <div className="dropdown-item">
                  <Link to="/orders" className="dropdown-item1">
                    <div className="dropdown-item-syb">
                      <LocalShippingIcon />
                    </div>
                    <div className="dropdown-item-text">My Orders</div>
                  </Link>
                </div>

                <div className="dropdown-item">
                  <Link to="/cart" className="dropdown-item1">
                    <div className="dropdown-item-syb">
                      <ShoppingCartOutlinedIcon />
                    </div>
                    <div className="dropdown-item-text">Cart</div>
                    <div className="dropdown-badge">3</div>
                  </Link>
                </div>

                <div className="dropdown-item">
                  <Link to="/wishlist" className="dropdown-item1">
                    <div className="dropdown-item-syb">
                      <FavoriteIcon />
                    </div>
                    <div className="dropdown-item-text">Wishlist</div>
                    <div className="dropdown-badge">5</div>
                  </Link>
                </div>

                <div className="dropdown-item logout-item" onClick={logout}>
                  <div className="dropdown-item1">
                    <div className="dropdown-item-syb logout-icon">
                      <LogoutSharpIcon sx={{ color: '#d32f2f' }} />
                    </div>
                    <div
                      className="dropdown-item-text logout-text"
                      style={{ color: '#d32f2f' }}
                    >
                      Logout
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="custom-link">
              <div className="head2">
                <PersonIcon fontSize="large" />
                <div className="entity">Login</div>
              </div>
            </Link>
          )}
        </div>
      )}
    </>
  );
}