import React from 'react';
import './Homepage.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import FolderSharedRoundedIcon from '@mui/icons-material/FolderSharedRounded';
import BrowseGalleryRoundedIcon from '@mui/icons-material/BrowseGalleryRounded';
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded';

const Homepage = () => {
  return (
    <div className='App'>
      <div id='animate-character'>
        <center><h1>TRENTAREV.</h1></center>
      </div>
      <Stack direction="row" spacing={2}>
        <Link to="/browsedecide" style={{ textDecoration: 'none' }}>
          <IconButton color='success' size="large">
            <BrowseGalleryRoundedIcon fontSize="large" />
          </IconButton>
        </Link>
        <Link to="/contricheck" style={{ textDecoration: 'none' }}>
          <IconButton color="error" aria-label="add an alarm" size="large">
            <PlaylistAddCheckCircleRoundedIcon fontSize="large" />
          </IconButton>
        </Link>
        <Link to="/yourcalls" style={{ textDecoration: 'none' }}>
          <IconButton color="primary" aria-label="add to shopping cart" size="large">
            <FolderSharedRoundedIcon fontSize="large" />
          </IconButton>
        </Link>
      </Stack>
    </div>
  );
};

export default Homepage;
