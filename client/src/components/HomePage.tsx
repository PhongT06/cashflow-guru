import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import '../HomePage.css';

const HomePage: React.FC = () => {
   const navigate = useNavigate();
   const [showVideo, setShowVideo] = useState(true);

   const handleVideoEnd = () => {
      setShowVideo(false);
   };

   const handleVideoError = () => {
      console.error('Video failed to load');
      setShowVideo(false);
   };

   const handleStartClick = () => {
      navigate('/login');
   };

   return (
      <div className="home-container">
         <div className="background-grid" />
         <Container maxWidth="md" className="home-content">
         {showVideo ? (
            <video
               className="video-player"
               autoPlay
               muted
               playsInline
               onEnded={handleVideoEnd}
               onError={handleVideoError}
               src="/videos/cashflow-intro.mp4"
            >
               Your browser does not support the video tag.
            </video>
         ) : (
            <div className="start-section">
               <MonetizationOnIcon className="home-icon" />
               <Typography className="home-title" variant="h3">
               Welcome to CashFlow Guru
               </Typography>
               <Typography className="home-subtitle" variant="h6">
               Meet your new assistant in finance.
               </Typography>
               <Button
               className="start-button"
               onClick={handleStartClick}
               variant="outlined"
               >
                  Click Here to Get Started
               </Button>
            </div>
         )}
         </Container>
      </div>
   );
};

export default HomePage;