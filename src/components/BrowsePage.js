import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { app } from './firebase';
import './BrowsePage.css';
import { getFirestore, collection, query, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { IconButton } from '@mui/material';
import { FaSignOutAlt } from 'react-icons/fa';
import { RiHomeGearFill } from "react-icons/ri";
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import { LinearProgress } from '@mui/material';
import axios from 'axios';
import { Fab, Modal, Backdrop, Fade } from '@mui/material';
import PageView from '@mui/icons-material/Navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BrowsePage = () => {
  const [stockCalls, setStockCalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = getAuth(app).currentUser;
  const [topPerformers, setTopPerformers] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [chartData, setChartData] = useState(null);

  const handleSearch = (symbol) => {
    setSelectedStock(symbol); // Set selectedStock when user performs a search
    fetchStockData(symbol); // Fetch stock data for the selected symbol
  };

  const NavtoHome = () => {
    window.location.href = '/';
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const symbols = ['MSFT', 'META', 'NVDA', 'TSLA', 'AMZN', 'UNH', 'XOM', 'GOOGL', 'RCL'];
        const apiKey = process.env.REACT_APP_ALPHA_API; // Replace with your IEX Cloud API key

        const scrapedData = await Promise.all(
          symbols.map(async symbol => {
            try {
              const response = await axios.get(`https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${apiKey}`);
              const data = response.data;
              console.log(data)

              // Extract relevant data from the response
              const stockPrice = data.latestPrice;
              const change = data.change;

              return { symbol, change, stockPrice };
            } catch (error) {
              console.error('Error fetching data for symbol', symbol, ':', error);
              return null;
            }
          })
        );

        // Filter out null values (in case of error during fetching)
        const data = scrapedData.filter(item => item !== null);

        setTopPerformers(data);
      } catch (error) {
        setError('Error occurred while fetching data from IEX Cloud.');
        console.error('Fetching error:', error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 10000);

    return () => {
      clearInterval(interval)
    };
  }, []);

  useEffect(() => {
    // Subscribe to real-time updates
    const db = getFirestore(app);
    const stockCallsRef = collection(db, 'stockCalls');
    const q = query(stockCallsRef, orderBy('postedAt', 'desc')); // Order by postedAt in descending order

    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStockCalls(data);
    });

    return unsubscribeSnapshot;
  }, []);

  const fetchStockData = async (symbol) => {
    try {
      const apiKey = process.env.REACT_APP_ALPHA_API; // Replace with your IEX Cloud API key
      const response = await axios.get(`https://cloud.iexapis.com/stable/stock/${symbol}/chart?range=5y&token=${apiKey}`);
      setChartData(response.data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  // Function to handle voting
  const handleVote = (index, voteType) => {
    if (!currentUser) {
      // User not logged in
      alert('Please log in to vote.');
      return;
    }

    const db = getFirestore(app);
    const callRef = doc(db, 'stockCalls', stockCalls[index].id);

    // Check if the user has already voted
    const hasVotedUp = stockCalls[index].upvotes[currentUser.uid];
    const hasVotedDown = stockCalls[index].downvotes[currentUser.uid];

    // If the user has already voted in the same direction, prevent them from voting again
    if ((voteType === 'up' && hasVotedUp) || (voteType === 'down' && hasVotedDown)) {
      alert('You have already voted here');
      return;
    }

    // If the user has already voted in the opposite direction, remove the opposite vote
    if (voteType === 'up' && hasVotedDown) {
      const newDownVotes = stockCalls[index].downCount - 1;
      const updateData = {
        downCount: newDownVotes,
        [`downvotes.${currentUser.uid}`]: false
      };

      updateDoc(callRef, updateData)
        .then(() => {
          console.log('Downvote removed successfully');
          // Update local state to reflect removal of downvote
          setStockCalls(prevStockCalls => {
            const updatedStockCalls = [...prevStockCalls];
            updatedStockCalls[index].downCount = newDownVotes;
            updatedStockCalls[index].downvotes[currentUser.uid] = false;
            return updatedStockCalls;
          });
        })
        .catch(error => {
          console.error('Error removing downvote:', error);
        });
    }

    // If the user has already voted in the opposite direction, remove the opposite vote
    if (voteType === 'down' && hasVotedUp) {
      const newUpVotes = stockCalls[index].upCount - 1;
      const updateData = {
        upCount: newUpVotes,
        [`upvotes.${currentUser.uid}`]: false
      };

      updateDoc(callRef, updateData)
        .then(() => {
          console.log('Upvote removed successfully');
          // Update local state to reflect removal of upvote
          setStockCalls(prevStockCalls => {
            const updatedStockCalls = [...prevStockCalls];
            updatedStockCalls[index].upCount = newUpVotes;
            updatedStockCalls[index].upvotes[currentUser.uid] = false;
            return updatedStockCalls;
          });
        })
        .catch(error => {
          console.error('Error removing upvote:', error);
        });
    }

    // Update the vote count in the database
    const newVotes = stockCalls[index][`${voteType}Count`] + 1;
    const updateData = {
      [`${voteType}Count`]: newVotes,
      [`${voteType}votes.${currentUser.uid}`]: true
    };

    updateDoc(callRef, updateData)
      .then(() => {
        console.log(`${voteType} vote recorded successfully`);
        // Update local state to reflect vote
        setStockCalls(prevStockCalls => {
          const updatedStockCalls = [...prevStockCalls];
          updatedStockCalls[index][`${voteType}Count`] = newVotes;
          updatedStockCalls[index][`${voteType}votes`][currentUser.uid] = true;
          return updatedStockCalls;
        });
      })
      .catch((error) => {
        console.error('Error recording vote:', error);
      });
  };



  // Calculate agreement percentage based on the local state
  const agreementPercentage = (index) => {
    const total = totalVotes(index);
    if (total === 0) return 0;

    const up = Object.values(stockCalls[index].upvotes).filter(vote => vote).length;
    return Math.round((up / total) * 100);
  };


  // Filter stock calls based on search term
  const filteredStockCalls = stockCalls.filter(call =>
    call.stockExchange.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.postedAt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.stockName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to calculate total votes for each call
  const totalVotes = (index) => {
    const up = stockCalls[index].upCount || 0;
    const down = stockCalls[index].downCount || 0;
    return up + down;
  };

  // Function to render agreement percentage
  // Inside the renderAgreement function
  const renderAgreement = (index) => {
    const percentage = agreementPercentage(index);
    return (
      <div>
        <LinearProgress variant="determinate" value={percentage} color={percentage >= 50 ? "primary" : "error"} />
      </div>
    );
  };




  // Logout function
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <div className="container">

      <div className="fab-container">
        <Fab color="primary" aria-label="add" variant='' onClick={handleOpen}>
          <PageView />
        </Fab>
      </div>

      {/* Popup */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className="popup-container">
            <input
              type="text"
              className="input-1"
              placeholder="Search"
              value={modalSearchTerm}
              onChange={e => setModalSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e.target.value);
                }
              }}
            />
            {selectedStock && chartData && (
              <div className="chart-container">
                <center><h4 className=''>{selectedStock}'s Performance (last 5 years)</h4></center>
                <LineChart width={600} height={300} data={chartData}>
                  <CartesianGrid strokeDasharray="5 5" stroke='#eee'/>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="close" stroke="#8884d8" />
                </LineChart>
              </div>
            )}
          </div>
        </Fade>
      </Modal>

      <div className="header">
        <div className='h1-1'>
          <h1 className="text-4xl font-bold">TRENTAREV.</h1>
        </div>
        <div className="logout-container">
          <IconButton onClick={NavtoHome} size='large' style={{ marginRight: '10px' }}>
            <RiHomeGearFill color='#ADD8E6' />
          </IconButton>
          <IconButton onClick={handleLogout} size="large">
            <FaSignOutAlt color='#ADD8E6' />
          </IconButton>
        </div>
      </div>
      <input
        type="text"
        className="input-1"
        placeholder="Search"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className="top-performers">
        {error && <div className="error-message">{error}</div>}
        <div className="performers-container">
          {topPerformers.map((performer, index) => (
            <div key={index} className={`performer ${performer.change < 0 ? 'negative' : ''}`}>
              <span className={`symbol ${performer.change >= 0 ? 'positive' : 'negative'}`}>{performer.symbol}: </span>
              {performer.change >= 0 && <span className={`change ${performer.change >= 0 ? 'positive' : 'negative'}`}>+</span> /* Render "+" if change is not negative */}
              <span className={`change ${performer.change >= 0 ? 'positive' : 'negative'}`}>{performer.change}</span>
            </div>
          ))}
          {topPerformers.map((performer, index) => (
            <div key={`duplicate-${index}`} className={`performer ${performer.change < 0 ? 'negative' : ''}`}>
              <span className={`symbol ${performer.change >= 0 ? 'positive' : 'negative'}`}>{performer.symbol}: </span>
              {performer.change >= 0 && <span className={`change ${performer.change >= 0 ? 'positive' : 'negative'}`}>+</span> /* Render "+" if change is not negative */}
              <span className={`change ${performer.change >= 0 ? 'positive' : 'negative'}`}>{performer.change}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {filteredStockCalls.map((call, index) => (
          <div key={index} className="card">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">STOCK EXCHANGE: {call.stockExchange}</h3>
              <p className="text-sm text-gray-600 mb-2">Stock: {call.stockName}</p>
              <p className="text-sm text-gray-600 mb-2">Posted At: {call.postedAt}</p>
              <p className="text-sm text-gray-700">{call.summary}</p>
            </div>
            <div className="vote-section">
              <IconButton onClick={() => handleVote(index, 'up')}>
                <AiOutlineArrowUp style={{ color: 'green' }} />
              </IconButton>
              <IconButton onClick={() => handleVote(index, 'down')}>
                <AiOutlineArrowDown style={{ color: 'red' }} />
              </IconButton>
              <div className="vote-count">{totalVotes(index)} people voted</div>
              {renderAgreement(index)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowsePage;
