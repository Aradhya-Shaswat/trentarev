import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import 'react-awesome-button/dist/styles.css';
import 'react-awesome-button/dist/themes/theme-blue.css';
import { FaArrowLeft } from 'react-icons/fa';
import { app } from './firebase';
import { useNavigate } from 'react-router-dom';
import './Contribute.css';
import { getAuth } from 'firebase/auth'; // Import getAuth
import IconButton from '@mui/material/IconButton';
import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import sanitize from 'sanitize-html';
import LinearProgress from '@mui/material/LinearProgress';
import { Box } from '@mui/material';

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

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const callToStatus = process.env.REACT_APP_STATUS_TO_POST_CALL;

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
    setLoading(true);
    sleep(3000);

    e.preventDefault();

    if (validateFields()) {
      setLoading(true);
      setError('');

      try {
        const auth = getAuth(); // Get auth instance
        const user = auth.currentUser; // Get current user

        // Sanitize input values
        const sanitizedStockExchange = sanitize(stockExchange);
        const sanitizedStockName = sanitize(stockName);
        const sanitizedSummary = sanitize(summary);

        const db = getFirestore(app);
        const docRef = await addDoc(collection(db, 'pendingStockCalls'), {
          stockExchange: sanitizedStockExchange,
          stockName: sanitizedStockName,
          summary: sanitizedSummary,
          submittedAt: new Date().toLocaleDateString(),
          submittedBy: user.uid, // Include the UID of the authenticated user
          callStatus: callToStatus, // Set the call status to 'Pending' by default
        });
        console.log('Document written with ID: ', docRef.id);
        // Clear form fields after successful submission
        setStockExchange('');
        setStockName('');
        setSummary('');
        setFormSubmitted(true); // Set formSubmitted to true
      } catch (err) {
        console.error('Error adding document: ', err);
        setError('An Error Occured!. Please Try Again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const validateFields = () => {
    // Split stock name by space and check each word's length
    const stockNameWords = stockName.split(' ');
    for (const word of stockNameWords) {
      if (word.length > 10) {
        setError('Each word in the stock name should be at most 10 letters.');
        return false;
      }
    }

    // Check if stock name has more than 4 words
    if (stockNameWords.length > 4) {
      setError('Stock name should be at most 4 words.');
      return false;
    }

    // Split summary by space and check each word's length
    const summaryWords = summary.split(' ');
    for (const word of summaryWords) {
      if (word.length > 10) {
        setError('Each word in the summary should be at most 10 letters.');
        return false;
      }
    }

    // Check if summary has at least 3 words
    if (summaryWords.length < 3) {
      setError('Summary should contain at least 3 words.');
      return false;
    }

    // Check if summary has more than 10 words
    if (summaryWords.length > 10) {
      setError('Summary should be at most 10 words.');
      return false;
    }

    return true;
  };


  return (
    <div className="container">
      <center><h1 className="text-4xl font-bold mb-8">TRENTAREV </h1></center>
      <center><h3>Report Stock Calls, Anonymously.</h3></center>
      <center>
        <Box sx={{
          width: '89%', // Set default width to 100% for smaller screens
          '@media (min-width: 600px)': { // Apply styles for screens wider than 600px
            width: '50%', // Set width to 50% for screens wider than 600px
          },
        }}>
          {loading && <LinearProgress color="secondary" />}
        </Box>
      </center>
      {error && <center><Alert className='success-alert' sx={{ color: 'red', textAlign: 'center' }} variant='outlined' severity="error">{error}</Alert></center>}
      {formSubmitted && <center><Alert className='success-alert' sx={{ color: '#90EE90', textAlign: 'center' }} variant='outlined' severity="success">Submitted!</Alert></center>}
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
          <IconButton aria-label="delete" size="small" onClick={goBackHome}>
            <FaArrowLeft fontSize="inherit" color='#ADD8E6' />
          </IconButton>
          <Button variant="outlined" color='success' onClick={handleSubmit} disabled={!stockExchange || !stockName || !summary ? true : false} endIcon={<SendIcon />}
            sx={{
              color: theme => theme.palette.primary.contrastText,
              // Change text color to primary contrast text color
              '&:disabled': {
                color: '#757575', // Custom color for disabled text
              },
            }}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Contribute;
