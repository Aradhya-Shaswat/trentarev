import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { app } from './firebase';
import './BrowsePage.css';
import { getFirestore, collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import 'react-awesome-button/dist/styles.css';
import { AwesomeButtonProgress } from "react-awesome-button";
import { FaSignOutAlt } from 'react-icons/fa';
import { RiHomeGearFill } from "react-icons/ri";
import { Navigate } from 'react-router-dom';

const BrowsePage = () => {
  const [stockCalls, setStockCalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const adminUid = process.env.REACT_APP_ADMIN_UID;

  useEffect(() => {
    const db = getFirestore(app);
    const stockCallsRef = collection(db, 'stockCalls');
    const q = query(stockCallsRef, orderBy('postedAt', 'desc')); // Order by postedAt in descending order

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setStockCalls(data);
    });

    return () => {
      // Unsubscribe from real-time updates when component unmounts
      unsubscribe();
    };
  }, []);

  // Filter stock calls based on search term
  const filteredStockCalls = stockCalls.filter(call =>
    call.stockExchange.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.postedAt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.stockName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const NavtoHome = () => {
    window.location.href = '/';
  }

  // Logout function
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

  return (
    <div className="container">
      <div className="header">
        <div className='h1-1'>
        <h1 className="text-4xl font-bold">TRENTAREV.</h1>
        </div>
        <div className="logout-container">
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
      
      <input
        type="text"
        className="input-1"
        placeholder="Search"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      ㅤ
      <hr className="separator mb-1" />
      ㅤ
      <div className="grid grid-cols-3 gap-8">
        {filteredStockCalls.map((call, index) => (
          <div key={index} className="card">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">STOCK EXCHANGE: {call.stockExchange}</h3>
              <p className="text-sm text-gray-600 mb-2">Stock: {call.stockName}</p>
              <p className="text-sm text-gray-600 mb-2">Posted At: {call.postedAt}</p>
              <p className="text-sm text-gray-700">{call.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowsePage;
