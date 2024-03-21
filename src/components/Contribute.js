import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { AwesomeButtonProgress, AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import 'react-awesome-button/dist/themes/theme-blue.css';
import { FaArrowLeft } from 'react-icons/fa';
import { app } from './firebase';
import { useNavigate } from 'react-router-dom';
import './Contribute.css';
import { getAuth } from 'firebase/auth'; // Import getAuth

const stockExchanges = [
  'XNYS', 'XNAS', 'XAMS', 'XSHG', 'XJPX', 'XSHE',
  'XNSE', 'XBOM', 'XHKG', 'XTSE', 'XLON', 'XSAU', 'XFRA', 'XSWX'
];

const Contribute = () => {
  const [stockExchange, setStockExchange] = useState('');
  const [stockName, setStockName] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false); // Track whether form is submitted
  const navigate = useNavigate();

  useEffect(() => {
    if (formSubmitted) {
      setTimeout(() => {
        navigate('/');
      }, 2000); // Navigate back home after 2 seconds
    }
  }, [formSubmitted, navigate]);

  const goBackHome = () => {
    console.log('navigating')
    navigate('/')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateFields()) {
      setLoading(true);
      setError('');

      try {
        const auth = getAuth(); // Get auth instance
        const user = auth.currentUser; // Get current user

        const db = getFirestore(app);
        const docRef = await addDoc(collection(db, 'pendingStockCalls'), {
          stockExchange,
          stockName,
          summary,
          submittedAt: new Date().toLocaleDateString(),
          submittedBy: user.uid, // Include the UID of the authenticated user
          callStatus: 'Pending', // Set the call status to 'Pending' by default
        });
        console.log('Document written with ID: ', docRef.id);
        // Clear form fields after successful submission
        setStockExchange('');
        setStockName('');
        setSummary('');
        setFormSubmitted(true); // Set formSubmitted to true
      } catch (err) {
        console.error('Error adding document: ', err);
        setError('An error occurred while submitting. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  const validateFields = () => {
    if (stockName.split(' ').length > 5) {
      setError('Stock name should be at most 5 words.');
      return false;
    }
    if (summary.split(' ').length > 10) {
      setError('Summary should be at most 10 words.');
      return false;
    }
    return true;
  };

  return (
    <div className="container">
      <center><h1 className="text-4xl font-bold mb-8">TRENTAREV. </h1></center>
      <center><h3>Report Stock Calls, Anonymously.</h3></center>
      {error && <p className="error">{error}</p>}
      {formSubmitted && <div id='form-submitted'><center><p className="success">Call Submitted!</p></center></div>}
      <form onSubmit={handleSubmit}>
        <label>
          <div id='text-label'>
            Stock Exchange:
          </div>
          {'ㅤ'}
          <select value={stockExchange} onChange={(e) => setStockExchange(e.target.value)} required>
            <option value="">Select Stock Exchange (NIC Format)</option>
            {stockExchanges.map((exchange, index) => (
              <option key={index} value={exchange}>{exchange}</option>
            ))}
          </select>
        </label>
        <label>
          <div id='text-label'>
            Stock Name:
          </div>
          {'ㅤ'}
          <input type="text" placeholder='Maximum 5 Words' value={stockName} onChange={(e) => setStockName(e.target.value)} required />
        </label>
        <label>
          <div id='text-label'>
            Summary:
          </div>
          {'ㅤ'}
          <textarea type='text' placeholder='Maximum 10 Words' value={summary} onChange={(e) => setSummary(e.target.value)} required />
        </label>
        <div className="button-container">
          <AwesomeButton
            type="primary"
            size="large"
            loading={loading}
            action={handleSubmit}
            disabled={!stockExchange || !stockName || !summary ? true : false} // Disable button if any of the fields are empty
          >
            Submit
          </AwesomeButton>
        </div>
      </form>
      <div className="button-container">
        <AwesomeButtonProgress
          type="secondary"
          size="icon"
          onPress={goBackHome}
          loadingLabel=".."
        >
          <FaArrowLeft size={20} />
        </AwesomeButtonProgress>
      </div>
    </div>
  );
};

export default Contribute;
