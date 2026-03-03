import React, { useState } from 'react';
import { Button, Container, TextField, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Auth.css';

const RegisterPage: React.FC = () => {
   const navigate = useNavigate();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

   const handleRegister = async () => {
      try {
         const registerResponse = await axios.post('http://localhost:3001/register', { email, password });
         setMessage({ type: 'success', text: registerResponse.data.message });

         const loginResponse = await axios.post('http://localhost:3001/login', { email, password });
         localStorage.setItem('token', loginResponse.data.token);
         window.dispatchEvent(new Event('storage'));

         setTimeout(() => {
         navigate('/financial-dashboard');
         }, 2000);
      } catch (error: any) {
         setMessage({ type: 'error', text: error.response?.data?.error || 'Registration failed' });
      }
   };

   return (
      <div className="auth-container">
         <div className="auth-grid" />
         <Container maxWidth="sm" className="auth-content">
            <Typography className="auth-title" variant="h4">
               Register
            </Typography>
            {message && (
               <Alert severity={message.type} className="auth-alert">
                  {message.text}
               </Alert>
            )}
            <TextField
               label="Email"
               fullWidth
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               margin="normal"
               className="auth-textfield"
            />
            <TextField
               label="Password"
               type="password"
               fullWidth
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               margin="normal"
               className="auth-textfield"
            />
            <Button
               fullWidth
               className="auth-button-primary"
               onClick={handleRegister}
            >
               Register
            </Button>
            <Button
               fullWidth
               className="auth-button-secondary"
               onClick={() => navigate('/login')}
            >
               Already have an account? Log In
            </Button>
         </Container>
      </div>
   );
};

export default RegisterPage;