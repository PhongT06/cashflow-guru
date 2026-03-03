import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Tracker from './components/Tracker';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import FinancialDashboard from './components/FinancialDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate('/login');
        return;
      }
      try {
        await axios.get('http://localhost:3001/expenses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error: any) {
        console.error('ProtectedRoute token validation failed:', error.response?.status);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setIsLoading(false);
        window.dispatchEvent(new Event('storage'));
        navigate('/login');
      }
    };

    validateToken();
  }, [navigate]);
  if (isLoading) return null;
  return isAuthenticated ? children : null;
};

const App: React.FC = () => {
  return (
    <Router> 
      <Navbar />
      <Routes> 
        <Route path="/" element={<HomePage />} /> 
        <Route path="/financial-dashboard" element={<ProtectedRoute><FinancialDashboard /></ProtectedRoute>} />
        <Route path="/tracker" element={<ProtectedRoute><Tracker /></ProtectedRoute>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
