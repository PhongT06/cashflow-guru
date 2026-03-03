export type Expense = {
   id: number;
   amount: number;
   category: string;
   date: string;
   userId: number;
};

export const expenseCategories = [
   'Food',
   'Rent',
   'Utilities',
   'Transportation',
   'Entertainment',
   'Clothing',
   'Health',
   'Insurance',
   'Education',
   'Travel',
   'Groceries',
   'Dining Out',
   'Subscriptions',
   'Hobbies',
   'Gifts',
   'Charity',
   'Personal Care',
   'Home Maintenance',
   'Taxes',
   'Savings',
   'Miscellaneous'
] as const;

export type ExpenseCategory = typeof expenseCategories[number];

export type Debt = {
   amount: number;
   interestRate: number;
};

export type SavingsGoal = {
   amount: number;
   targetDate: string;
};