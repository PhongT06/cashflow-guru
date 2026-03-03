import React from 'react';
import { Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { validateExpenseForm } from '../utils/formValidation';
import { ExpenseCategory } from '../types';

interface ExpenseFormProps {
   amount: string;
   category: ExpenseCategory | '';
   date: string;
   setAmount: (value: string) => void;
   setCategory: (value: ExpenseCategory | '') => void;
   setDate: (value: string) => void;
   errors: Partial<{ amount: string; category: string; date: string }>;
   setErrors: (errors: Partial<{ amount: string; category: string; date: string }>) => void;
   validationMessage: string;
   setValidationMessage: (message: string) => void;
   onAddExpense: (newExpense: { amount: number; category: string; date: string }) => Promise<void>;
   categories: readonly string[];
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
   amount,
   category,
   date,
   setAmount,
   setCategory,
   setDate,
   errors,
   setErrors,
   validationMessage,
   setValidationMessage,
   onAddExpense,
   categories,
}) => {
   const handleAddExpense = async () => {
      const formData = { amount, category, date };
      const { isValid, errors, message } = validateExpenseForm(formData);
      setErrors(errors);
      setValidationMessage(message || '');

      if (!isValid) {
         return;
      }

      try {
         const newExpense = { amount: Number(amount), category, date };
         await onAddExpense(newExpense);
         setAmount('');
         setCategory('');
         setDate('');
         setErrors({});
         setValidationMessage('');
      } catch (error) {
         console.error('Error adding expense:', error);
         setValidationMessage('Failed to add expense. Please try again.');
      }
   };

   return (
      <div style={{ marginTop: '20px' }}>
         <Typography 
            variant="h5" 
            marginBottom='25px' 
            style={{ color: '#fff' }}
         >
            Track Your Expenses
         </Typography>
         <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px', 
            marginBottom: '20px',
            alignItems: 'flex-start'
         }}>
            <TextField
               label="Amount"
               type="number"
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
               variant="outlined"
               error={!!errors.amount}
               helperText={errors.amount}
               style={{ flex: '1 1 150px', minWidth: '100px' }}
               InputLabelProps={{
                  shrink: true,
                  style: { color: '#0ff', top: '-8px' }
               }}
               InputProps={{
                  style: {
                     backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     border: '1px solid #0ff',
                     color: '#fff',
                  },
               }}
            />
            <FormControl 
               variant="outlined" 
               error={!!errors.category}
               style={{ flex: '1 1 150px', minWidth: '100px' }}
            >
               <InputLabel 
                  id="category-label" 
                  shrink 
                  style={{ color: '#0ff', top: '-8px' }}
               >
                  Category
               </InputLabel>
               <Select
                  labelId="category-label"
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory | '')}
                  style={{ 
                     minWidth: '120px',
                     backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     border: '1px solid #0ff',
                     color: '#fff'
                  }}
               >
                  <MenuItem value="">
                     <em style={{ color: '#ff' }}>Select a category</em>
                  </MenuItem>
                  {categories.map((cat) => (
                     <MenuItem key={cat} value={cat} style={{ color: '#ff' }}>
                        {cat}
                     </MenuItem>
                  ))}
               </Select>
               {!!errors.category && (
                  <Typography color="error" variant="caption" style={{ marginLeft: '14px', marginTop: '3px' }}>
                     {errors.category}
                  </Typography>
               )}
            </FormControl>
            <TextField
               label="Date"
               type="date"
               value={date}
               onChange={(e) => setDate(e.target.value)}
               variant="outlined"
               InputLabelProps={{ 
                  shrink: true, 
                  style: { color: '#0ff', top: '-8px' }
               }}
               error={!!errors.date}
               helperText={errors.date}
               style={{ flex: '1 1 150px', minWidth: '100px' }}
               InputProps={{
                  style: {
                     backgroundColor: 'rgba(255, 255, 255, 0.1)',
                     border: '1px solid #0ff',
                     color: '#fff',
                  },
               }}
            />
            <Button 
               variant="contained" 
               onClick={handleAddExpense}
               style={{ 
                  flex: '0 0 auto', 
                  height: '56px',
                  backgroundColor: '#0ff',
                  color: '#000'
               }}
            >
               Add Expense
            </Button>
         </div>
         {validationMessage && (
            <Typography color="error" variant="body2" style={{ marginBottom: '10px' }}>
               {validationMessage}
            </Typography>
         )}
      </div>
   );
};

export default ExpenseForm;