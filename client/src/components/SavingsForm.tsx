import React from 'react';
import { Button, Typography, TextField } from '@mui/material';

interface SavingsFormData {
   amount: string;
   targetDate: string;
}

interface SavingsFormProps {
   amount: string;
   targetDate: string;
   setAmount: (value: string) => void;
   setTargetDate: (value: string) => void;
   errors: Partial<SavingsFormData>;
   setErrors: (errors: Partial<SavingsFormData>) => void;
   validationMessage: string;
   setValidationMessage: (message: string) => void;
   onAddSavingsGoal: (newSavingsGoal: { amount: number; targetDate: string }) => void;
}

const validateSavingsForm = (formData: SavingsFormData): { isValid: boolean; errors: Partial<SavingsFormData>; message?: string } => {
   const errors: Partial<SavingsFormData> = {};
   let isValid = true;

   if (!formData.amount || Number(formData.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0';
      isValid = false;
   }

   if (!formData.targetDate) {
      errors.targetDate = 'Target date is required';
      isValid = false;
   }

   const message = isValid ? undefined : 'Please fill out all fields correctly';
   return { isValid, errors, message };
};

const SavingsForm: React.FC<SavingsFormProps> = ({
   amount,
   targetDate,
   setAmount,
   setTargetDate,
   errors,
   setErrors,
   validationMessage,
   setValidationMessage,
   onAddSavingsGoal,
}) => {
   const handleAddSavingsGoal = () => {
      const formData = { amount, targetDate };
      const { isValid, errors, message } = validateSavingsForm(formData);
      setErrors(errors);
      setValidationMessage(message || '');

      if (!isValid) {
         return;
      }

      try {
         const newSavingsGoal = { amount: Number(amount), targetDate };
         onAddSavingsGoal(newSavingsGoal);
         setAmount('');
         setTargetDate('');
         setErrors({});
         setValidationMessage('');
      } catch (error) {
         console.error('Error adding savings goal:', error);
         setValidationMessage('Failed to add savings goal. Please try again.');
      }
   };

   return (
      <div style={{ marginTop: '20px' }}>
         <Typography 
            variant="h5" 
            marginBottom='25px' 
            style={{ color: '#fff' }}
         >
            Add Your Savings Goals
         </Typography>
         <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px', 
            marginBottom: '20px',
            alignItems: 'flex-start'
         }}>
         <TextField
            label="Savings Amount"
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
         <TextField
            label="Target Date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            variant="outlined"
            error={!!errors.targetDate}
            helperText={errors.targetDate}
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
         <Button 
            variant="contained" 
            onClick={handleAddSavingsGoal}
            style={{ 
               flex: '0 0 auto', 
               height: '56px',
               backgroundColor: '#0ff',
               color: '#000'
            }}
         >
            Add Savings Goal
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

export default SavingsForm;