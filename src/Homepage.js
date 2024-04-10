import React from 'react';
import './Homepage.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { ButtonGroup } from '@mui/material';
import { Button } from '@mui/material';

const Homepage = () => {
  return (
    <div className='App'>
      <h1>TRENTAREV</h1>
      <Stack direction="row" spacing={2}>
        <ButtonGroup variant="outlined" aria-label="." color='primary'>
          <Link to="/browsedecide" style={{ textDecoration: 'none' }}>
            <Button style={{ color: 'yellow', fontSize: '16px', borderColor: '#e7cc90' }}>Browse</Button>
          </Link>
          <Link to="/contricheck" style={{ textDecoration: 'none' }}>
            <Button style={{ color: 'yellow', fontSize: '16px', borderColor: '#e7cc90' }}>Contribute</Button>
          </Link>
          <Link to="/yourcalls" style={{ textDecoration: 'none' }}>
            <Button style={{ color: 'yellow', fontSize: '16px', borderColor: '#e7cc90' }}>Account</Button>
          </Link>
        </ButtonGroup>
      </Stack>

    </div>
  );
};

export default Homepage;
