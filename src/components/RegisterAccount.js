import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions
import Cookies from 'js-cookie'; // Import Cookies utility
import './RegisterAccount.css'; // Import CSS file for styling
import './LoginPage.css'; // Import CSS file for styling
import { Button, Icon } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { FaArrowRight } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa';
import { Box } from '@mui/material';
import { LinearProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import CancelIcon from '@mui/icons-material/Cancel';
import HandshakeIcon from '@mui/icons-material/Handshake';

const RegisterAccount = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [reason, setReason] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false); // State to track loading status
  const [error, setError] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false); // State to track form submission
  const navigate = useNavigate();

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  

  const handleRegister = async (e) => {
    setLoading(true);
    sleep(3000)
    e.preventDefault();

    try {
      sleep(2000)
      if (password !== confirmPassword) {
        setError('Password Validation Error!');
        setLoading(false);
        return;
      }

      // Check if the cookie exists and if the time elapsed since the last request is less than 30 minutes
      const lastRequestTime = Cookies.get('lastRequestTime');
      if (lastRequestTime && Date.now() - parseInt(lastRequestTime) < 7 * 24 * 60 * 60 * 1000) {
        setError('You can only request an account once every 1 week.');
        console.log('hm')
        setLoading(false);
        return;
      }

      // Check if summary has at least 3 words
      if (reason.length < 3) {
        setError('Reason should have at least 3 words.');
        setLoading(false);
        return false;
      }

      // Check if summary has more than 10 words
      if (reason.length > 10) {
        setError('Reason should be at most 15 words.');
        setLoading(false);
        return false;
      }

      const db = getFirestore();
      const pendingAccountsCollection = collection(db, 'pendingAccountsCollection');
      await addDoc(pendingAccountsCollection, {
        email,
        password,
        submittedAt: serverTimestamp(),
        reason: reason // Add server timestamp
      });

      // Set the cookie to track the time of the last request
      Cookies.set('lastRequestTime', Date.now().toString());

      // Show success message and navigate after 2 seconds
      setFormSubmitted(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      setLoading(false);
      setError('Request Failed!');
      console.log(error);
      await sleep(3000);
      setError('');
    }


  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="register-account-container dark-theme">
      {!agreed ? (
        <div className="terms-container">
        <h2 className="terms-heading">Terms and Conditions</h2>
        <p className="terms-text">
          Account Creation decision rests with TRENTAREV Corp. You will be contacted for the payment of 75$ once we approve your account. Failure in submitting the fee will result in termination of your account and you will not be able to request any additional account for upto 3 years.
        </p>
        <div className="terms-buttons">
          <Button color='primary' onClick={() => setAgreed(true)} variant="outlined" startIcon={<HandshakeIcon fontSize='inherit'/>}>I Agree</Button>
          ㅤ
          <Button color='error' variant='outlined' onClick={handleHome} startIcon={<CancelIcon fontSize='inherit'/>}>I disagree</Button>
        </div>
      </div>
      
      ) : (
        <div className="login-container">
          <div className="logo-container">
            <h1>Register</h1>
          </div>
          {error && <Alert severity="error" variant='outlined' sx={{ color: 'red', textAlign: 'center', marginTop: '6px', marginBottom: '-20px' }} onClose={() => setError(null)}>{error}</Alert>}
          {formSubmitted && <Alert severity="success" variant='outlined' className='success-message' sx={{ color: '#90EE90', textAlign: 'center', marginTop: '6px' }}>Request Sent!</Alert>}
          <Box sx={{ width: '180px', marginTop: '15px' }}>
            {loading && <LinearProgress color="secondary" />}
          </Box>
          <form onSubmit={handleRegister}>
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
                type="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for Request"
                required
                id='reason'
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
            <div className="input-group">
              <input
                type="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                id='confirmPassword'
              />
            </div>
            <center>
            <Button type="submit" variant='outlined' startIcon={<FaArrowRight size={10} />} className="login-button">
              Submit
            </Button>
            </center>
          </form>
          <Button onClick={handleHome} color='secondary' startIcon={<FaArrowLeft size={10} />} className="login-button">
            Go Back
          </Button>
        </div>
      )}
    </div>
  );
};

export default RegisterAccount;
