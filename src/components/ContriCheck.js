// ContriCheck.js

import React from 'react';
import { isLoggedIn } from './auth';
import { Navigate } from 'react-router-dom';

const ContriCheck = () => {
  // Check if user is logged in
  const loggedIn = isLoggedIn();

  return (
    <div>
      {loggedIn ? (
        // If user is logged in, render Contribute
        <Navigate to="/contribute" />
      ) : (
        // If user is not logged in, redirect to login page
        <Navigate to='/login' />
      )}
    </div>
  );
}

export default ContriCheck;
