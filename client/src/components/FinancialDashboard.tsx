import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import DebtForm from './DebtForm';
import SavingsForm from './SavingsForm';
import IncomeForm from './IncomeForm';
import ExpenseForm from './ExpenseForm';
import { ExpenseCategory, expenseCategories, Debt, SavingsGoal } from '../types';

const FinancialDashboard: React.FC = () => {
   const [debts, setDebts] = useState<Debt[]>([]);
   const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
   const [income, setIncome] = useState<string>('');
   const [debtAmount, setDebtAmount] = useState('');
   const [interestRate, setInterestRate] = useState('');
   const [savingsAmount, setSavingsAmount] = useState('');
   const [targetDate, setTargetDate] = useState('');
   const [expenseAmount, setExpenseAmount] = useState('');
   const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory | ''>('');
   const [expenseDate, setExpenseDate] = useState('');
   const [debtErrors, setDebtErrors] = useState<Partial<{ amount: string; interestRate: string }>>({});
   const [savingsErrors, setSavingsErrors] = useState<Partial<{ amount: string; targetDate: string }>>({});
   const [incomeErrors, setIncomeErrors] = useState<Partial<{ income: string }>>({});
   const [expenseErrors, setExpenseErrors] = useState<Partial<{ amount: string; category: string; date: string }>>({});
   const [debtValidationMessage, setDebtValidationMessage] = useState<string>('');
   const [savingsValidationMessage, setSavingsValidationMessage] = useState<string>('');
   const [incomeValidationMessage, setIncomeValidationMessage] = useState<string>('');
   const [expenseValidationMessage, setExpenseValidationMessage] = useState<string>('');
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string>('');
   const navigate = useNavigate();

   const addDebt = (newDebt: { amount: number; interestRate: number }) => {
      setDebts([...debts, newDebt]);
   };

   const addSavingsGoal = (newSavingsGoal: { amount: number; targetDate: string }) => {
      setSavingsGoals([...savingsGoals, newSavingsGoal]);
   };

   const addExpense = async (newExpense: { amount: number; category: string; date: string }) => {
      try {
         const token = localStorage.getItem('token');
         console.log('Adding expense with token:', token);
         if (!token) {
         navigate('/login');
         return;
         }
         await axios.post('http://localhost:3001/expenses', newExpense, {
         headers: { Authorization: `Bearer ${token}` },
         });
         setExpenseAmount('');
         setExpenseCategory('');
         setExpenseDate('');
      } catch (error: any) {
         console.error('Error adding expense:', error);
         if (error.response?.status === 403) {
         localStorage.removeItem('token');
         window.dispatchEvent(new Event('storage'));
         navigate('/login');
         }
      }
   };

   const handleGetAdvice = async () => {
      setIsLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
         navigate('/login');
         return;
      }
      try {
         await axios.post('http://localhost:3001/profile', { income: Number(income), debts, savingsGoals }, {
         headers: { Authorization: `Bearer ${token}` },
         });
         const response = await axios.post('http://localhost:3001/advice', {}, {
         headers: { Authorization: `Bearer ${token}` },
         });
         navigate('/tracker', { state: { advice: response.data.advice } });
      } catch (err: any) {
         console.error('Error fetching advice:', err);
         if (err.response?.status === 403) {
         localStorage.removeItem('token');
         window.dispatchEvent(new Event('storage'));
         navigate('/login');         } else if (err.response?.status === 429 || err.response?.status === 503) {
            setError(err.response?.data?.error || 'AI service unavailable. Please try again later.');         } else {
         setError(err.response?.data?.error || 'Failed to fetch advice.');
         }
      } finally {
         setIsLoading(false);
      }
   };

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
         position: 'relative',
         overflow: 'hidden',
         }}
      >
         {/* Background Glowing Dots */}
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
         <Container
            maxWidth="lg"
            sx={{
               zIndex: 1,
               color: '#fff',
            }}
         >
         {/* 2x2 Grid of Sections */}
         <div
            style={{
               display: 'grid',
               gridTemplateColumns: 'repeat(2, 1fr)',
               gap: '40px',
               padding: '20px',
               justifyItems: 'center',
            }}
         >
            {/* Debt Payoff Section */}
            <div
               style={{
               width: '300px',
               background: 'rgba(10, 10, 30, 0.9)',
               border: '2px solid #0ff',
               borderRadius: '10px',
               padding: '20px',
               boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
               transition: 'box-shadow 0.3s ease-in-out',
               position: 'relative',
               overflow: 'hidden',
               }}
               onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 255, 255, 0.6)')}
               onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.3)')}
            >
               <style>
               {`
                  @keyframes pulseGlow {
                     0% {
                     background-position: 0% 50%;
                     }
                     100% {
                     background-position: 200% 50%;
                     }
                  }
                  .glow-box::before {
                     content: '';
                     position: absolute;
                     top: 0;
                     left: 0;
                     width: 100%;
                     height: 2px;
                     background: linear-gradient(
                     90deg,
                     transparent,
                     rgba(0, 255, 255, 0.8),
                     transparent
                     );
                     background-size: 200% 100%;
                     animation: pulseGlow 2s linear infinite;
                  }
               `}
               </style>
               <div className="glow-box">
               <DebtForm
                  amount={debtAmount}
                  interestRate={interestRate}
                  setAmount={setDebtAmount}
                  setInterestRate={setInterestRate}
                  errors={debtErrors}
                  setErrors={setDebtErrors}
                  validationMessage={debtValidationMessage}
                  setValidationMessage={setDebtValidationMessage}
                  onAddDebt={addDebt}
               />
               <ul style={{ marginTop: '10px', color: '#0ff', textAlign: 'center', fontSize: '14px' }}>
                  {debts.map((debt, index) => (
                     <li key={index}>${debt.amount} at {debt.interestRate}%</li>
                  ))}
               </ul>
               </div>
            </div>

            {/* Savings Goal Section */}
            <div
               style={{
               width: '300px',
               background: 'rgba(10, 10, 30, 0.9)',
               border: '2px solid #ff0fff',
               borderRadius: '10px',
               padding: '20px',
               boxShadow: '0 0 15px rgba(255, 15, 255, 0.3)',
               transition: 'box-shadow 0.3s ease-in-out',
               position: 'relative',
               overflow: 'hidden',
               }}
               onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 15, 255, 0.6)')}
               onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 15, 255, 0.3)')}
            >
               <div className="glow-box">
                  <SavingsForm
                     amount={savingsAmount}
                     targetDate={targetDate}
                     setAmount={setSavingsAmount}
                     setTargetDate={setTargetDate}
                     errors={savingsErrors}
                     setErrors={setSavingsErrors}
                     validationMessage={savingsValidationMessage}
                     setValidationMessage={setSavingsValidationMessage}
                     onAddSavingsGoal={addSavingsGoal}
                  />
                  <ul style={{ marginTop: '10px', color: '#ff0fff', textAlign: 'center', fontSize: '14px' }}>
                     {savingsGoals.map((goal, index) => (
                        <li key={index}>${goal.amount} by {goal.targetDate}</li>
                     ))}
                  </ul>
               </div>
            </div>

            {/* Income Section */}
            <div
               style={{
               width: '300px',
               background: 'rgba(10, 10, 30, 0.9)',
               border: '2px solid #00ff00',
               borderRadius: '10px',
               padding: '20px',
               boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)',
               transition: 'box-shadow 0.3s ease-in-out',
               position: 'relative',
               overflow: 'hidden',
               }}
               onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 255, 0, 0.6)')}
               onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.3)')}
            >
               <div className="glow-box">
               <IncomeForm
                  income={income}
                  setIncome={setIncome}
                  errors={incomeErrors}
                  setErrors={setIncomeErrors}
                  validationMessage={incomeValidationMessage}
                  setValidationMessage={setIncomeValidationMessage}
               />
               {income && (
                  <Typography style={{ color: '#00ff00', textAlign: 'center', fontSize: '14px', marginTop: '10px' }}>
                     ${income}
                  </Typography>
               )}
               </div>
            </div>

            {/* Expenses Section */}
            <div
               style={{
               width: '300px',
               background: 'rgba(10, 10, 30, 0.9)',
               border: '2px solid #ff9900',
               borderRadius: '10px',
               padding: '20px',
               boxShadow: '0 0 15px rgba(255, 153, 0, 0.3)',
               transition: 'box-shadow 0.3s ease-in-out',
               position: 'relative',
               overflow: 'hidden',
               }}
               onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 153, 0, 0.6)')}
               onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 153, 0, 0.3)')}
            >
               <div className="glow-box">
               <ExpenseForm
                  amount={expenseAmount}
                  category={expenseCategory}
                  date={expenseDate}
                  setAmount={setExpenseAmount}
                  setCategory={setExpenseCategory}
                  setDate={setExpenseDate}
                  errors={expenseErrors}
                  setErrors={setExpenseErrors}
                  validationMessage={expenseValidationMessage}
                  setValidationMessage={setExpenseValidationMessage}
                  onAddExpense={addExpense}
                  categories={expenseCategories}
               />
               </div>
            </div>
         </div>

         {/* Get Advice Button */}
         <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Button
               variant="contained"
               onClick={handleGetAdvice}
               disabled={isLoading}
               style={{
               backgroundColor: '#0ff',
               color: '#000',
               padding: '10px 20px',
               boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
               transition: 'box-shadow 0.3s ease-in-out',
               }}
               onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.8)')}
               onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.5)')}
            >
               {isLoading ? 'Loading...' : 'Get Advice & View Tracker'}
            </Button>
            {error && (
               <Typography color="error" variant="body2" style={{ marginTop: '20px' }}>
               {error}
               </Typography>
            )}
         </div>
         </Container>
      </div>
   );
};

export default FinancialDashboard;