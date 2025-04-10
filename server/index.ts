import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000'}));

type Expense = {
   id: number;
   amount: number;
   category: string;
   date: string;
};

let expenses: Expense[] = [];

app.post('/expenses', (req, res) => {
   const { amount, category, date } = req.body;
   const newExpense: Expense = {
      id: expenses.length + 1,
      amount,
      category,
      date,
   };
   expenses.push(newExpense);
   res.status(201).json(newExpense);
});

app.get('/expenses', (req, res) => {
   res.json(expenses);
});

app.listen(3001, () => console.log('Server running on port 3001'));