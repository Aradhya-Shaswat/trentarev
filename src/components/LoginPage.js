import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { isLoggedIn } from './auth';
import './LoginPage.css'; // Import CSS file for styling
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const authInstance = getAuth();
      await signInWithEmailAndPassword(authInstance, email, password);
      
      // Save login status in local storage
      localStorage.setItem('isLoggedIn', 'true');
      console.log('logged in')

      // Redirect to Contribute page after successful login
      navigate('/contribute');
      console.log('navigated')
    } catch (error) {
      setError('LOGIN FAILED');
      await sleep(3000);
      setError('');
    }
  };

  const handleLogout = () => {
    // Clear login status from local storage
    localStorage.removeItem('isLoggedIn');
    console.log('logged out')
    // Redirect to login page after logout
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <h1>TRENTAREV.</h1>
      </div>
      <div className="separator">ㅤ</div>
      <div className="signin-container">
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="login-button">
            <FaArrowRight size={14}/>
          </button>
        </form>
      </div>
      <button className="back-button" onClick={handleLogout}>
        <FaArrowLeft size={10}/>
        <span>  </span>
      </button>
    </div>
  );
};

export default LoginPage;
