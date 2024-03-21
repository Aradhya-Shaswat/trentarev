import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn } from './components/auth';
import BrowseDecide from './components/BrowseDecide';
import BrowseLimit from './components/BrowseLimit';
import BrowsePage from './components/BrowsePage';
import Contribute from './components/Contribute';
import YourCalls from './components/YourCalls';
import Homepage from './Homepage';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/AdminPanel';
import ContriCheck from './components/ContriCheck';
import { auth } from './components/firebase';
import RegisterAccount from './components/RegisterAccount'; 
import Layout from './Layout';
import NotFound from './NotFound';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const adminUid = process.env.REACT_APP_ADMIN_UID;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div>
      <Router>
        <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/browsedecide" element={<BrowseDecide />} />
          <Route path="/browselimit" element={!isLoggedIn() ? <BrowseLimit /> : <Navigate to="/browsepage"/>} />
          <Route path="/login" element={!isLoggedIn() ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/browsepage" element={isLoggedIn() ? <BrowsePage /> : <Navigate to="/login" />} />
          <Route path="/contribute" element={isLoggedIn() ? <Contribute /> : <Navigate to="/login" />} />
          <Route path="/yourcalls" element={isLoggedIn() ? <YourCalls /> : <Navigate to='/login' />} />
          <Route
            path="/admin"
            element={user && user.uid === adminUid ? <AdminPanel /> : <Navigate to="/" />}
          />
          <Route path='/register' element={!isLoggedIn() ? <RegisterAccount /> : <Navigate to="/" />} />
          <Route path="/contricheck" element={<ContriCheck />} />
          <Route path="*" element={<NotFound />} /> 
        </Routes>
        </Layout>
      </Router>
    </div>
  );
}


export default App;