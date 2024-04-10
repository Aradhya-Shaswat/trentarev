import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDoc, doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import Firebase auth instance
import './AdminPanel.css'; // Import CSS file for styling
import { RiHomeGearFill } from 'react-icons/ri';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [pendingCalls, setPendingCalls] = useState([]);
  const auth = getAuth(); // Firebase auth instance

  const Navigate = useNavigate();

  const NavtoHome = () => {
    Navigate('/')
  }

  useEffect(() => {
    const fetchPendingCalls = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const callsRef = collection(db, 'pendingStockCalls');
          const q = query(callsRef, where('callStatus', '==', 'Pending'));
          
          // Subscribe to real-time updates
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const pendingCallsData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setPendingCalls(pendingCallsData);
          });

          // Clean up function to unsubscribe when component unmounts
          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching pending calls:', error);
      }
    };

    fetchPendingCalls();
  }, [auth.currentUser]);
  

  const approveCall = async (callId) => {
    try {
      const db = getFirestore();
      const pendingCallRef = doc(db, 'pendingStockCalls', callId);
      const pendingCallSnapshot = await getDoc(pendingCallRef);
      await updateDoc(pendingCallRef, { callStatus: 'Approved' });
  
      if (pendingCallSnapshot.exists()) {
        const callData = pendingCallSnapshot.data();
        const stockCallsRef = collection(db, 'stockCalls');
        
        // Update submittedAt to postedAt
        const updatedCallData = { ...callData, postedAt: callData.submittedAt, callStatus: 'Approved' };
        delete updatedCallData.submittedAt;
  
        // Set the document in the 'stockCalls' collection
        await setDoc(doc(stockCallsRef, callId), updatedCallData);
        console.log('Stock call approved successfully.');
      }
    } catch (error) {
      console.error('Error approving stock call:', error);
    }
  };
  
  const rejectCall = async (callId) => {
    try {
      const db = getFirestore();
      const pendingCallRef = doc(db, 'pendingStockCalls', callId);
      await updateDoc(pendingCallRef, { callStatus: 'Rejected' });
      console.log('Stock call rejected successfully.');
    } catch (error) {
      console.error('Error rejecting stock call:', error);
    }
  };
  

  return (
    <div className="container">
      <div className='header'>
      <h1 className="h1-1">TRENTAREV</h1>
      <div className="logout-container">
      <IconButton
            type="primary"
            onClick={NavtoHome}
            size='large'
            style={{ marginRight: '10px' }} 
            color='secondary'
          >
            <RiHomeGearFill color='#ADD8E6'/>
          </IconButton>
        </div>
      </div>
      <hr></hr>
      <div className="grid calls-list">
        {pendingCalls.length === 0 && <p>No pending calls found.</p>}
        {pendingCalls.map((call) => (
          <div key={call.id} className="card call-item">
            <div className="content">
              <h3>{call.stockName}</h3>
              <p>Stock Exchange: {call.stockExchange}</p>
              <p>Summary: {call.summary}</p>
              <p>Submitted At: {call.submittedAt}</p>
              <div className="button-container">
                <button className="approve-button" onClick={() => approveCall(call.id)}>Approve</button>
                <button className="reject-button" onClick={() => rejectCall(call.id)}>Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
