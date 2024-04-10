import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth'; // Import Firebase auth instance
import './YourCalls.css'; // Import CSS file for styling
import { AwesomeButtonProgress } from 'react-awesome-button';
import { IconButton } from '@mui/material';
import { RiHomeGearFill } from 'react-icons/ri';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { RiAdminFill } from 'react-icons/ri';
import { Box } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';


const YourCalls = () => {
  const [userCalls, setUserCalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const auth = getAuth(); // Firebase auth instance
  const adminUid = process.env.REACT_APP_ADMIN_UID;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const Navigate = useNavigate();

  const handleAdmin = () => {
    setLoading(true);
    sleep(1000);
    Navigate('/admin')
  }

  const handleLogout = () => {
    setLoading(true);
    sleep(1000);
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        Navigate('/')
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const NavtoHome = () => {
    setLoading(true);
    sleep(1000);
    Navigate('/')
  }

  useEffect(() => {
    const fetchUserCalls = async () => {
      if (auth.currentUser) {
        const db = getFirestore();
        const callsRef = collection(db, 'pendingStockCalls');
        const userUID = auth.currentUser.uid;

        const q = query(callsRef, where('submittedBy', '==', userUID));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const callsData = [];
          snapshot.forEach((doc) => {
            callsData.push({ id: doc.id, ...doc.data() });
          });
          setUserCalls(callsData);
        });

        return () => unsubscribe(); // Unsubscribe from snapshot listener on unmount
      }
    };

    fetchUserCalls();
  }, [auth.currentUser]);

  return (
    <div className="container">
      <div className="header">
        <div className='h1-1'>
        <h1 className="text-4xl font-bold">TRENTAREV</h1>
        </div>
        <div className="logout-container">
        {auth.currentUser && auth.currentUser.uid === adminUid && (
          <IconButton
          type="primary"
          onClick={handleAdmin}
          size='large'
          style={{ marginRight: '10px' }} 
          color='secondary'
        >
          <RiAdminFill color='#ADD8E6'/>
        </IconButton>
        )}
          <IconButton
            type="primary"
            onClick={NavtoHome}
            size='large'
            style={{ marginRight: '10px' }} 
            color='secondary'
          >
            <RiHomeGearFill color='#ADD8E6'/>
          </IconButton>
          <IconButton
            type="primary"
            size="large"
            onClick={handleLogout}
          >
            <FaSignOutAlt color='#ADD8E6'/>
          </IconButton>
        </div>
      </div>
      <Box sx={{ width: '16.5%' }}>
          {loading && <LinearProgress color="primary"/>}
      </Box>
      <hr></hr>
      <h2>Your Stock Calls</h2>
      <div className="grid calls-list">
        {userCalls.length === 0 && <p>No calls found.</p>}
        {userCalls.map((call) => (
          <div key={call.id} className="card call-item">
            <div className="content">
              <h3>{call.stockName}</h3>
              <p>Stock Exchange: {call.stockExchange}</p>
              <p>Summary: {call.summary}</p>
              <p>Submitted At: {call.submittedAt}</p>
              <p>Status: <span className={`status-${call.callStatus.toLowerCase()}`}>{call.callStatus}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourCalls;
