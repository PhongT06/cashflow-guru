import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Typography } from '@mui/material';
import SpendingChart from './SpendingChart';
import SpendingSummary from './SpendingSummary';
import { Expense, Debt, SavingsGoal } from '../types';
import '../Tracker.css';

interface FinancialData {
   income: number;
   debts: Debt[];
   savingsGoals: SavingsGoal[];
   expenses: Expense[];
}

const Tracker: React.FC = () => {
   const [financialData, setFinancialData] = useState<FinancialData | null>(null);
   const [advice, setAdvice] = useState<string | null>(null);
   const [error, setError] = useState<string>('');
   const navigate = useNavigate();
   const location = useLocation();
   const initialAdvice = useRef<string | undefined>((location.state as { advice?: string })?.advice);
   const hasFetched = useRef(false);

   useEffect(() => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      const fetchFinancialData = async () => {
         try {
            const token = localStorage.getItem('token');
            if (!token) {
               navigate('/login');
               return;
            }
            const profileResponse = await axios.get('http://localhost:3001/profile', {
               headers: { Authorization: `Bearer ${token}` },
            });
            const expensesResponse = await axios.get('http://localhost:3001/expenses', {
               headers: { Authorization: `Bearer ${token}` },
            });

            const routeAdvice = initialAdvice.current;
            if (routeAdvice) {
               setAdvice(routeAdvice);
            } else {
               const adviceResponse = await axios.post('http://localhost:3001/advice', {}, {
                  headers: { Authorization: `Bearer ${token}` },
               });
               setAdvice(adviceResponse.data.advice);
            }

            const data: FinancialData = {
               income: profileResponse.data.income || 0,
               debts: profileResponse.data.debts || [],
               savingsGoals: profileResponse.data.savingsGoals || [],
               expenses: expensesResponse.data || [],
            };
            setFinancialData(data);
         } catch (error: any) {
            console.error('Error fetching financial data:', error);
            if (error.response?.status === 403) {
               localStorage.removeItem('token');
               window.dispatchEvent(new Event('storage'));
               navigate('/login');
            } else {
               setError('Failed to load financial data. Please try again later.');
            }
         }
      };

      fetchFinancialData();
   }, [navigate]);

   if (error) {
      return (
         <div
            style={{
               background: 'radial-gradient(circle, rgba(0, 10, 30, 1) 0%, rgba(0, 0, 10, 1) 100%)',
               minHeight: '100vh',
               width: '100vw',
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               color: '#fff',
            }}
         >
            <Typography color="error">{error}</Typography>
         </div>
      );
   }

   if (!financialData) {
      return (
         <div
            style={{
               background: 'radial-gradient(circle, rgba(0, 10, 30, 1) 0%, rgba(0, 0, 10, 1) 100%)',
               minHeight: '100vh',
               width: '100vw',
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               color: '#fff',
            }}
         >
            <Typography>Loading...</Typography>
         </div>
      );
   }

   const totalExpenses = financialData.expenses.reduce((sum, expense) => {
      const amount = typeof expense.amount === 'number' && !isNaN(expense.amount) ? expense.amount : 0;
      return sum + amount;
   }, 0);

   return (
      <div
         style={{
         background: 'radial-gradient(circle, rgba(0, 10, 30, 1) 0%, rgba(0, 0, 10, 1) 100%)',
         minHeight: '100vh',
         width: '100vw',
         display: 'flex',
         justifyContent: 'center',
         alignItems: 'center',
         padding: '20px',
         paddingTop: '80px',
         position: 'relative',
         overflowX: 'hidden',
         boxSizing: 'border-box',
         }}
      >
         <div
            style={{
               position: 'absolute',
               width: '100%',
               height: '100%',
               background: 'radial-gradient(circle, rgba(0, 255, 255, 0.1) 1px, transparent 1px)',
               backgroundSize: '20px 20px',
               opacity: 0.5,
            }}
         />
         <div
            style={{
               zIndex: 1,
               color: '#fff',
               width: '100%',
               maxWidth: '100%',
               padding: '0 10px',
               boxSizing: 'border-box',
            }}
         >
         {advice && (
            <div className="advice-section">
               <Typography className="advice-title" variant="h5">
                  CashFlow Guru says:
               </Typography>
               <div className="advice-content">
                  <Typography>
                     {advice || 'No advice generated. Please review your financial data.'}
                  </Typography>
               </div>
            </div>
         )}

         <Typography className="overview-title" variant="h4" style={{ color: '#0ff', textAlign: 'center', marginBottom: '40px', fontFamily: 'Orbitron, sans-serif' }}>
            Your Financial Overview
         </Typography>

         <div className="financial-container">
            <div className="financial-section">
               <div className="section-title" style={{ color: '#0ff' }}>
                  <span>💳</span> Debt Payoff
               </div>
               <div className="section-content debt-content">
                  {financialData.debts.length > 0 ? (
                     financialData.debts.map((debt, index) => (
                        <div key={index}>${debt.amount} at {debt.interestRate}%</div>
                     ))
                  ) : (
                     <div>No debts recorded</div>
                  )}
               </div>
            </div>

            <div className="financial-section">
               <div className="section-title" style={{ color: '#00ff00' }}>
                  <span>💵</span> Income
               </div>
               <div className="section-content income-content">
                  {financialData.income > 0 ? `$${financialData.income}` : 'No income recorded'}
               </div>
            </div>

            <div className="financial-section">
               <div className="section-title" style={{ color: '#ff0fff' }}>
                  <span>🐷</span> Savings Goals
               </div>
               <div className="section-content savings-content">
                  {financialData.savingsGoals.length > 0 ? (
                     financialData.savingsGoals.map((goal, index) => (
                        <div key={index}>${goal.amount} by {goal.targetDate}</div>
                     ))
                  ) : (
                     <div>No savings goals recorded</div>
                  )}
               </div>
            </div>

            <div className="financial-section">
               <div className="section-title" style={{ color: '#ff9900' }}>
                  <span>💸</span> Total Expenses
               </div>
               <div className="section-content expenses-content">
                  {totalExpenses > 0 ? `$${totalExpenses.toFixed(2)}` : 'No expenses recorded'}
               </div>
            </div>
         </div>

            <div className="chart-section" style={{ marginTop: '40px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
               <SpendingChart expenses={financialData.expenses} />
               <SpendingSummary expenses={financialData.expenses} />
            </div>
         </div>
      </div>
   );
};

export default Tracker;