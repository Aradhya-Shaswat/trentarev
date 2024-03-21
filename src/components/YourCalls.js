import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth'; // Import Firebase auth instance
import './YourCalls.css'; // Import CSS file for styling
import { AwesomeButtonProgress } from 'react-awesome-button';
import { RiHomeGearFill } from 'react-icons/ri';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { RiAdminFill } from 'react-icons/ri';


const YourCalls = () => {
  const [userCalls, setUserCalls] = useState([]);
  const auth = getAuth(); // Firebase auth instance
  const adminUid = process.env.REACT_APP_ADMIN_UID;

  const Navigate = useNavigate();


  const handleAdmin = () => {

    Navigate('/admin')
  }

  const handleLogout = () => {
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
        <h1 className="text-4xl font-bold">TRENTAREV.</h1>
        </div>
        <div className="logout-container">
        {auth.currentUser && auth.currentUser.uid === adminUid && (
          <AwesomeButtonProgress
            type="primary"
            size="icon"
            onPress={handleAdmin}
            style={{ marginRight: '10px' }} 
            loadingLabel='..'
          >
            <RiAdminFill />
          </AwesomeButtonProgress>
        )}
          <AwesomeButtonProgress
            type="primary"
            size="icon"
            onPress={NavtoHome}
            style={{ marginRight: '10px' }} 
            loadingLabel='..'
          >
            <RiHomeGearFill />
          </AwesomeButtonProgress>
          <AwesomeButtonProgress
            type="primary"
            size="icon"
            onPress={handleLogout}
            loadingLabel='..'
          >
            <FaSignOutAlt />
          </AwesomeButtonProgress>
        </div>
      </div>
      <hr></hr>
      <h2>Your Calls</h2>
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
