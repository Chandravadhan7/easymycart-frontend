import { Route, Routes } from 'react-router-dom';
import Login from './loginpage';
import { Link } from 'react-router-dom';
import SignUp from './signup';
import { useLocation } from 'react-router-dom';

export default function DashBoard() {
  const location = useLocation();

  const hideButtons =
    location.pathname === '/user/login' || location.pathname === '/user/signup';

  return (
    <div>
      {!hideButtons && (
        <nav>
          <Link to="/user/login">
            <button>Login</button>
          </Link>
          <Link to="/user/signup">
            <button>Sign Up</button>
          </Link>
        </nav>
      )}

      <Routes>
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}
