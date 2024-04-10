import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { isLoggedIn } from './auth';
import './LoginPage.css'; // Import CSS file for styling
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Alert, Button, Box } from '@mui/material';
import { RequestPageOutlined } from '@mui/icons-material';
import LinearProgress,  { linearProgressClasses } from '@mui/material/LinearProgress';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const goToRegister = () => {
    navigate('/register');
  }
  
  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const authInstance = getAuth();
      await signInWithEmailAndPassword(authInstance, email, password);
      setSuccess('Login Successful!');
      await sleep(5000);
      
      // Save login status in local storage
      localStorage.setItem('isLoggedIn', 'true');
      console.log('logged in')

      // Redirect to Contribute page after successful login
      navigate('/contribute');
      console.log('navigated')
    } catch (error) {
      await sleep(1000);
      setLoading(false);
      setError('Login Failed!');
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
        <h1>TRENTAREV</h1>
      </div>
      ㅤ
      {error && <Alert severity="error" variant='outlined' sx={{ color: 'red', textAlign: 'center' }}>ACCESS DENIED</Alert>}
      {success && <Alert severity="success" variant='outlined' className='success-message' sx={{ color: '#90EE90', textAlign: 'center' }}>LOGGED IN!</Alert>}
      ㅤ
      <Box sx={{ width: '250px' }}>
      {loading && <LinearProgress color="primary"/>}
      </Box>
      <div className="signin-container">
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
              id='password'
            />
          </div>
          <Button type="submit" variant='outlined' className="login-button">
            Login
          </Button>
          
        </form>
      </div>
      <Button onClick={goToRegister} color='secondary' startIcon={<RequestPageOutlined size={20}/>} className="login-button-1">
            <h3>Request Account</h3>
      </Button>
      <Button onClick={handleLogout} color='secondary' className="login-button">
            Back
      </Button>
    </div>
  );
};

export default LoginPage;
