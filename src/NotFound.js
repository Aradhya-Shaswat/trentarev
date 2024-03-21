import React from 'react';
import './NotFound.css';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className='i-404'>
            <div className='text-container'>
                <center><h1>404 | Not found</h1></center>
            </div>
            <div className='button-container'>
                <Link to='/'>
                <center>
                    <Fab variant="extended" color='success'>
                        <NavigationIcon sx={{ mr: 1 }} />
                        <b>Go Back Home</b>
                    </Fab>
                </center>
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
