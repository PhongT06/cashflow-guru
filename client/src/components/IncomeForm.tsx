import React from 'react';
import { Typography, TextField, Button } from '@mui/material';

interface IncomeFormData {
   income: string;
}

interface IncomeFormProps {
   income: string;
   setIncome: (value: string) => void;
   errors: Partial<IncomeFormData>;
   setErrors: (errors: Partial<IncomeFormData>) => void;
   validationMessage: string;
   setValidationMessage: (message: string) => void;
}

const validateIncomeForm = (formData: IncomeFormData): { isValid: boolean; errors: Partial<IncomeFormData>; message?: string } => {
   const errors: Partial<IncomeFormData> = {};
   let isValid = true;

   if (!formData.income || Number(formData.income) <= 0) {
      errors.income = 'Income must be greater than 0';
      isValid = false;
   }

   const message = isValid ? undefined : 'Please enter a valid income';
   return { isValid, errors, message };
};

const IncomeForm: React.FC<IncomeFormProps> = ({
   income,
   setIncome,
   errors,
   setErrors,
   validationMessage,
   setValidationMessage,
}) => {
   const handleSave = () => {
      const formData = { income };
      const { errors, message } = validateIncomeForm(formData);
      setErrors(errors);
      setValidationMessage(message || '');
   };
   const handleChange = (value: string) => {
      setIncome(value);
      const formData = { income: value };
      const { errors, message } = validateIncomeForm(formData);
      setErrors(errors);
      setValidationMessage(message || '');
   };

   return (
      <div style={{ marginTop: '20px' }}>
         <Typography 
            variant="h5" 
            marginBottom='25px' 
            style={{ color: '#fff' }}
         >
            Enter Your Monthly Income
         </Typography>
         <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px', 
            marginBottom: '20px',
            alignItems: 'flex-start'
         }}>
         <TextField
            label="Monthly Income"
            type="number"
            value={income}
            onChange={(e) => handleChange(e.target.value)}
            variant="outlined"
            error={!!errors.income}
            helperText={errors.income}
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
            onClick={handleSave}
            style={{ 
               flex: '0 0 auto', 
               height: '56px',
               backgroundColor: '#0ff',
               color: '#000'
            }}
         >
            Save Income
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

export default IncomeForm;