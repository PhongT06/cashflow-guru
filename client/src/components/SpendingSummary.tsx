import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Expense, expenseCategories } from '../types';
import { getCategoryTotals } from '../utils/expenseUtils';

interface SpendingSummaryProps {
   expenses: Expense[];
}

const SpendingSummary: React.FC<SpendingSummaryProps> = ({ expenses }) => {
   const categoryTotals = getCategoryTotals(expenses);
   const totalSpending = Object.values(categoryTotals).reduce((acc, val) => acc + val, 0);
   const filteredCategories = expenseCategories.filter((cat) => categoryTotals[cat] > 0);

   return (
      <TableContainer
         component={Paper}
         className="summary-table"
         style={{
            backgroundColor: 'rgba(10, 10, 30, 0.9)',
            marginTop: '20px',
            animation: 'glow 2s infinite',
         }}
      >
         <Table>
            <TableHead>
               <TableRow>
                  <TableCell style={{ color: '#0ff', fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell align="center" style={{ color: '#0ff', fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell align="right" style={{ color: '#0ff', fontWeight: 'bold' }}>Percentage</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {filteredCategories.map((cat) => {
                  const amount = categoryTotals[cat];
                  const percentage = totalSpending > 0 ? ((amount / totalSpending) * 100).toFixed(2) : '0.00';
                  return (
                  <TableRow key={cat}>
                     <TableCell style={{ color: '#fff' }}>{cat}</TableCell>
                     <TableCell align="right" style={{ color: '#fff' }}>${amount.toFixed(2)}</TableCell>
                     <TableCell align="right" style={{ color: '#fff' }}>{percentage}%</TableCell>
                  </TableRow>
                  );
               })}
               {filteredCategories.length === 0 && (
                  <TableRow>
                     <TableCell colSpan={3} style={{ color: '#fff', textAlign: 'center' }}>
                        No expenses added yet.
                     </TableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>
      </TableContainer>
   );
};

export default SpendingSummary;