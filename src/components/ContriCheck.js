import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ContriCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Redirect based on login status
    if (loggedIn) {
      navigate('/contribute');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Render nothing here, as the redirect happens inside useEffect
  return null;
}

export default ContriCheck;
