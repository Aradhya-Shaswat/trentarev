import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, getDocs, onSnapshot } from 'firebase/firestore';
import { AwesomeButtonProgress } from "react-awesome-button";
import 'react-awesome-button/dist/styles.css';
import 'react-awesome-button/dist/themes/theme-blue.css';
import './BrowseLimit.css';
import { app } from './firebase';

const BrowseLimit = () => {
  const [stockCalls, setStockCalls] = useState([]);

  const NavtoLogin = () => {
    window.location.href = '/login';
  }

  const OpenAccForm = () => {
    window.location.href = '/register';
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore(app);
        const stockCallsRef = collection(db, 'stockCalls');
        const querySnapshot = await getDocs(stockCallsRef);
        const data = querySnapshot.docs.map(doc => doc.data());

        // Shuffle the data array
        const shuffledData = data.sort(() => Math.random() - 0.5);

        // Select the first 3 items
        const selectedData = shuffledData.slice(0, 3);

        setStockCalls(selectedData);
      } catch (error) {
        console.error('Error fetching documents: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1 className="text-4xl font-bold mb-8">TRENTAREV.</h1>

      <input
        type="text"
        className="input"
        placeholder="Search"
        disabled
      />
      ㅤ
      <hr className="separator mb-1" />
      ㅤ
      <div className="grid grid-cols-3 gap-8">
        {stockCalls.map((call, index) => (
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
      <div className="grid grid-cols-3 gap-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="card-blank">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">ㅤ</h3>
              <p className="text-sm text-gray-600 mb-2">ㅤ</p>
              <p className="text-sm text-gray-700">ㅤ</p>
              <p className="text-sm text-gray-700">ㅤ</p>
            </div>
          </div>
        ))}
      </div>
      <div className="see-more-container">
        <div className='see-more'>
          Want to see more?
        </div>
      </div>
      <div className="button-container">
        <AwesomeButtonProgress
          type="primary"
          size="large"
          onPress={NavtoLogin}
        >
          Login
        </AwesomeButtonProgress>
        <AwesomeButtonProgress
          type="secondary"
          size="large"
          onPress={OpenAccForm}
        >
          Request Access
        </AwesomeButtonProgress>
      </div>
    </div>
  );
};

export default BrowseLimit;
