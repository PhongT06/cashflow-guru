import React from 'react';
import { Button, Typography, TextField } from '@mui/material';

interface DebtFormData {
   amount: string;
   interestRate: string;
}

interface DebtFormProps {
   amount: string;
   interestRate: string;
   setAmount: (value: string) => void;
   setInterestRate: (value: string) => void;
   errors: Partial<DebtFormData>;
   setErrors: (errors: Partial<DebtFormData>) => void;
   validationMessage: string;
   setValidationMessage: (message: string) => void;
   onAddDebt: (newDebt: { amount: number; interestRate: number }) => void;
}

const validateDebtForm = (formData: DebtFormData): { isValid: boolean; errors: Partial<DebtFormData>; message?: string } => {
   const errors: Partial<DebtFormData> = {};
   let isValid = true;

   if (!formData.amount || Number(formData.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0';
      isValid = false;
   }

   if (!formData.interestRate || Number(formData.interestRate) < 0) {
      errors.interestRate = 'Interest rate must be 0 or greater';
      isValid = false;
   }

   const message = isValid ? undefined : 'Please fill out all fields correctly';
   return { isValid, errors, message };
};

const DebtForm: React.FC<DebtFormProps> = ({
   amount,
   interestRate,
   setAmount,
   setInterestRate,
   errors,
   setErrors,
   validationMessage,
   setValidationMessage,
   onAddDebt,
   }) => {
   const handleAddDebt = () => {
      const formData = { amount, interestRate };
      const { isValid, errors, message } = validateDebtForm(formData);
      setErrors(errors);
      setValidationMessage(message || '');

      if (!isValid) {
         return;
      }

      try {
         const newDebt = { amount: Number(amount), interestRate: Number(interestRate) };
         onAddDebt(newDebt);
         setAmount('');
         setInterestRate('');
         setErrors({});
         setValidationMessage('');
      } catch (error) {
         console.error('Error adding debt:', error);
         setValidationMessage('Failed to add debt. Please try again.');
      }
   };

   return (
      <div style={{ marginTop: '20px' }}>
         <Typography 
            variant="h5" 
            marginBottom='25px' 
            style={{ color: '#fff' }}
         >
         Add Your Debts
         </Typography>
            <div style={{ 
               display: 'flex',
               flexWrap: 'wrap',
               gap: '10px', 
               marginBottom: '20px',
               alignItems: 'flex-start'
            }}>
         <TextField
            label="Debt Amount"
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
            label="Interest Rate (%)"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            variant="outlined"
            error={!!errors.interestRate}
            helperText={errors.interestRate}
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
            onClick={handleAddDebt}
            style={{ 
               flex: '0 0 auto', 
               height: '56px',
               backgroundColor: '#0ff',
               color: '#000'
            }}
         >
            Add Debt
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

export default DebtForm;