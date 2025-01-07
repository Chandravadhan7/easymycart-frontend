import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';

export default function Login() {
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  let [usernameError, setUsernameError] = useState('');
  let [passwordError, setPasswordError] = useState('');
  let navigate = useNavigate();

  const validate = () => {
    let isValid = true;

    setUsernameError('');
    setPasswordError('');

    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    let inputobj = { userName: username, password: password };
    fetch('http://localhost:8080/user/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputobj),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Invalid credentials');
        }
        return response.json();
      })
      .then((loginResponseDto) => {
        console.log('User received from backend:', loginResponseDto);
        localStorage.setItem('sessionId', loginResponseDto.sessionId);
        localStorage.setItem('userId', loginResponseDto.userId);
        navigate('/home');
        // if (user && user.userName === username ) {
        //     if( user.password === password){
        //     sessionStorage.setItem('username', user.userName);
        //     navigate('/home');
        //     }
        //     else{
        //         setPasswordError('Invalid  password');
        //     }
        // } else {
        //     setPasswordError('Invalid username or password');
        // }
      })
      .catch((err) => {
        console.error('Login error:', err);
        setPasswordError('Invalid username or password');
      });
  };

  return (
    <div className="row">
      <div className="offset-lg-3 col-lg-6">
        <form onSubmit={handleSubmit} className="contain">
          <div className="crd">
            <div className="crd-header">
              <h2>User Login</h2>
            </div>
            <div className="crd-body">
              <div className="form-group">
                <label>
                  User Name <span className="errmsg">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                  placeholder="Enter Username"
                />
                {usernameError && (
                  <div className="error-message">{usernameError}</div>
                )}
              </div>
              <div className="form-group">
                <label>
                  Password <span className="errmsg">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Enter Password"
                />
                {passwordError && (
                  <div className="error-message">{passwordError}</div>
                )}
              </div>
            </div>
            <div className="crd-footer">
              <button type="submit" className="bttn btn-primary">
                Login
              </button>{' '}
              |
              <Link className="bttn btn-success" to={'/user/signup'}>
                New User
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
