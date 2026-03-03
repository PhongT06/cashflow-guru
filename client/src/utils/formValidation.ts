interface ExpenseFormData {
   amount: string;
   category: string;
   date: string;
}

export const validateExpenseForm = (formData: ExpenseFormData): { isValid: boolean; errors: Partial<ExpenseFormData>; message?: string } => {
   const errors: Partial<ExpenseFormData> = {};
   let isValid = true;

   if (!formData.amount || Number(formData.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0';
      isValid = false;
   }

   if (!formData.category.trim()) {
      errors.category = 'Category is required';
      isValid = false;
   }

   if (!formData.date) {
      errors.date = 'Date is required';
      isValid = false;
   }

   const message = isValid ? undefined : 'Please fill out all fields';
   return { isValid, errors, message }
};