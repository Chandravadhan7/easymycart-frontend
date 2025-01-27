import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';
import Person4Icon from '@mui/icons-material/Person4';
import KeyIcon from '@mui/icons-material/Key';


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
        localStorage.setItem('userName',username);
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
      <div className="login-cont">
        <form onSubmit={handleSubmit} className="contain">
          <div className="crd">
            <div className="crd-header">
              Sign In
            </div>
            <div className="crd-body">
              <div className="form-group">
              <div style={{display:'flex',gap:'2%'}}>
              <div><Person4Icon fontSize='large'/></div>
          
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                  placeholder="Username"
                /></div>
                {usernameError && (
                  <div className="error-message">{usernameError}</div>
                )}
              </div>
              <div className="form-group">
              <div style={{display:'flex',gap:'2%'}}>
              <div><KeyIcon fontSize='large'/></div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Password"
                /></div>
                <div style={{width:'95%',height:'30%',textAlign:'right',lineHeight:'250%',color:'#b20f1a'}}>Forget password?</div>
                {passwordError && (
                  <div className="error-message">{passwordError}</div>
                )}
              </div>
              <button type="submit" className="bttn btn-primary">
                LOGIN
              </button>
            </div>
            <div className="crd-footer">
              Don't have an account? {' '}{' '}{' '}
              <Link  to={'/signup'}>
                {' '}Sign Up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
