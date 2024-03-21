import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth } from './firebase'; // Import Firebase Auth instance
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions
import Cookies from 'js-cookie'; // Import Cookies utility
import './RegisterAccount.css'; // Import CSS file for styling

const RegisterAccount = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false); // State to track form submission
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Password Validation Error!');
      return;
    }

    // Check if the cookie exists and if the time elapsed since the last request is less than 30 minutes
    const lastRequestTime = Cookies.get('lastRequestTime');
    if (lastRequestTime && Date.now() - parseInt(lastRequestTime) < 7 * 24 * 60 * 60 * 1000) {
      setError('You can only request an account once every 1 week.');
      return;
    }    

    const db = getFirestore();
    const pendingAccountsCollection = collection(db, 'pendingAccounts');
    await addDoc(pendingAccountsCollection, {
      email,
      password,
      submittedAt: serverTimestamp() // Add server timestamp
    });

    // Set the cookie to track the time of the last request
    Cookies.set('lastRequestTime', Date.now().toString());

    // Show success message and navigate after 2 seconds
    setFormSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="register-account-container">
      {!agreed ? (
        <div>
          <h2 style={{ textAlign: 'center' }}>Terms and Conditions</h2>
          <p style={{ textAlign: 'center' }}>You agree that you are over 18 years of age and will pay the sum of 75$ when creating a TRENTAREV Account.</p>
          <button className='i-button' onClick={() => setAgreed(true)}>I Agree</button>
          ㅤ
          <button className='i-button' onClick={handleHome}>Go Back</button>
        </div>
      ) : (
        <div>
          <h2><center>Request Account</center></h2>
          {formSubmitted && (
            <div id='form-submitted'><center><p className="success">Request Submitted!</p></center></div>
          )}
          <form className="register-account-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button className="confirm-account-button" type="submit">Submit Request</button>
            ㅤ
            <button className="confirm-account-button" onClick={handleHome}>Go Back</button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default RegisterAccount;
