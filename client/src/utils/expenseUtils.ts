import { Expense, ExpenseCategory, expenseCategories } from '../types';

export const getCategoryTotals = (expenses: Expense[]): Record<ExpenseCategory, number> => {
   const totals: Partial<Record<ExpenseCategory, number>> = {};
   expenseCategories.forEach((cat) => {
      totals[cat] = 0;
   });
   expenses.forEach((expense) => {
      if (expense.category in totals) {
         totals[expense.category as ExpenseCategory]! += expense.amount;
      }
   });
   return totals as Record<ExpenseCategory, number>;
};