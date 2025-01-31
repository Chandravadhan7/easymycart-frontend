import { useState } from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';
import Person4Icon from '@mui/icons-material/Person4';
import EmailIcon from '@mui/icons-material/Email';
import HttpsIcon from '@mui/icons-material/Https';
import KeyIcon from '@mui/icons-material/Key';
export default function SignUp() {
  let [username, setUsername] = useState('');
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [confirmPassword, setConfirmPassword] = useState('');
  let [usernameError, setUsernameError] = useState('');
  let [emailError, setEmailError] = useState('');
  let [passwordError, setPasswordError] = useState('');
  let [confirmPasswordError, setConfirmPasswordError] = useState('');

  let navigate = useNavigate();
  const validate = () => {
    let isValid = true;

    setUsernameError('');
    setEmailError('');
    setPasswordError('');

    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('A valid email is required');
      isValid = false;
    }
    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const inputObj = { userName: username, email: email, password: password };

    fetch('http://localhost:8080/user/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputObj),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Signup failed');
        return response.json();
      })
      .then((data) => {
        alert('Account created successfully!');
        navigate('/login');
      })
      .catch((err) => {
        console.error('Signup error:', err);
      });
  };

  return (
    <div className="main">
      <div className="cont">
        <div className='cont1'>
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit} className='form'>
          <div className="frm-grp">
            <div style={{display:'flex',gap:'3%'}}>
              <div><Person4Icon fontSize='large'/></div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" Username"
            /></div>
            {usernameError && (
              <div className="error-message">{usernameError}</div>
            )}
          </div>
          <div className="frm-grp">
          <div style={{display:'flex',gap:'3%'}}>
              <div><EmailIcon fontSize='large'/></div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" Email"
            />
            </div>
            {emailError && <div className="error-message">{emailError}</div>}
          </div>
          <div className="frm-grp">
          <div style={{display:'flex',gap:'3%'}}>
              <div><HttpsIcon fontSize='large'/></div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" Password"
            /></div>
            {passwordError && (
              <div className="error-message">{passwordError}</div>
            )}
          </div>
          <div className="frm-grp">
          <div style={{display:'flex',gap:'3%'}}>
              <div><KeyIcon fontSize='large'/></div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
            </div>
            {confirmPasswordError && (
              <div className="error-message">{confirmPasswordError}</div>
            )}
          </div>
          <button className="bttns" type="submit">
            Sign Up
          </button>
        </form>
        <div className="card-footer">
          Already have an account? <a href="/login">Log in</a>
        </div>
        </div>
      </div>
    </div>
  );
}
