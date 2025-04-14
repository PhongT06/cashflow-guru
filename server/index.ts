import express, { Request, Response,  RequestHandler } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000'}));

type User = {
   id: number;
   email: string;
   password: string;
}

type Expense = {
   id: number;
   amount: number;
   category: string;
   date: string;
};

let users: User[] = [];

let expenses: Expense[] = [];

app.post('/expenses', (req: Request, res: Response) => {
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

app.get('/expenses', (req: Request, res: Response) => {
   res.json(expenses);
});

const registerHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
   const { email, password } = req.body;
   if (!email || !password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
   }
   if (users.find((u) => u.email === email)) {
      res.status(400).json({ error: 'Email already exists' });
      return;
   }
   const hashedPassword = await bcrypt.hash(password, 10);
   const user: User = {
      id: users.length + 1,
      email,
      password: hashedPassword,
   };
   users.push(user);
   res.status(201).json({ message: 'User registered successfully' });
};

app.post('/register', registerHandler);

app.listen(3001, () => console.log('Server running on port 3001'));