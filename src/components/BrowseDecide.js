// BrowseDecide.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from './auth';

const BrowseDecide = () => {
  // Check if user is logged in
  const loggedIn = isLoggedIn();

  return (
    <div>
      {loggedIn ? (
        // If user is logged in, redirect to BrowsePage
        <Navigate to="/browsepage" />
      ) : (
        // If user is not logged in, redirect to BrowseLimit
        <Navigate to="/browselimit" />
      )}
    </div>
  );
}

export default BrowseDecide;
