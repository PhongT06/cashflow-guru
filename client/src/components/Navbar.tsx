import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import MenuIcon from '@mui/icons-material/Menu';
import '../Navbar.css';

const Navbar: React.FC = () => {
   const navigate = useNavigate();
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

   useEffect(() => {
      const validateToken = async () => {
         const token = localStorage.getItem('token');
         if (!token) {
            setIsLoggedIn(false);
            return;
         }

         try {
            await axios.get('http://localhost:3001/expenses', {
               headers: { Authorization: `Bearer ${token}` },
            });
            setIsLoggedIn(true);
         } catch (error: any) {
            console.error('Token validation failed:', error.response?.status);
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            window.dispatchEvent(new Event('storage'));
         }
      };

      validateToken();

      const handleStorageChange = () => {
         validateToken();
      };

      window.addEventListener('storage', handleStorageChange);

      return () => {
         window.removeEventListener('storage', handleStorageChange);
      };
   }, []);

   const handleLogout = () => {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      window.dispatchEvent(new Event('storage'));
      navigate('/login');
   };

   const handleLogin = () => {
      navigate('/login');
   };

   const toggleMobileMenu = () => {
      setMobileMenuOpen(!mobileMenuOpen);
   };

   return (
      <AppBar position="fixed" className="navbar-container">
         <Toolbar className="navbar-toolbar">
            {/* Brand Name */}
            <Typography
               className="navbar-brand"
               component={Link}
               to="/"
            >
               <MonetizationOnIcon sx={{ mr: 1 }} />
               CashFlow Guru
            </Typography>

            {/* Subtitle (Hidden on Mobile) */}
            <Typography className="navbar-subtitle" variant="subtitle1" component="div">
               Your AI Finance Companion
            </Typography>

            {/* Navigation Links */}
            <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
               {isLoggedIn && (
                  <>
                  <Link to="/financial-dashboard" className="navbar-link">
                     Financial Dashboard
                  </Link>
                  <Link to="/tracker" className="navbar-link">
                     Tracker
                  </Link>
                  </>
               )}
               {isLoggedIn ? (
                  <Button className="navbar-button" onClick={handleLogout}>
                  Logout
                  </Button>
               ) : (
                  <Button className="navbar-button" onClick={handleLogin}>
                  Log In
                  </Button>
               )}
            </div>

            {/* Hamburger Menu for Mobile */}
            <IconButton
               className="navbar-hamburger"
               onClick={toggleMobileMenu}
               sx={{ display: { xs: 'block', sm: 'none' } }}
            >
               <MenuIcon />
            </IconButton>
         </Toolbar>
      </AppBar>
   );
};

export default Navbar;