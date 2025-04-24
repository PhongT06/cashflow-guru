import express, { Request, Response, RequestHandler, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

interface AuthRequest extends Request {
   user?: { userId: number };
}

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
   throw new Error('JWT_SECRET is not set in environment variables');
}

const authenticateToken: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];
   if (!token) {
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return;
   }
   try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      (req as AuthRequest).user = decoded;
      next();
   } catch (error) {
      res.status(403).json({ error: 'Forbidden: Invalid token' });
   }
};

app.post('/expenses', authenticateToken, async (req: AuthRequest, res: Response) => {
   const { amount, category, date } = req.body;
   const userId = req.user?.userId;

   if (!userId) {
      res.status(401).json({ error: 'Unauthorized: User ID not found' });
      return;
   }

   if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      res.status(400).json({ error: 'Invalid or missing amount; it must be a positive number' });
      return;
   }
   if (typeof category !== 'string' || category.trim() === '') {
      res.status(400).json({ error: 'Invalid or missing category; it must be a non-empty string' });
      return;
   }
   if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: 'Invalid or missing date; it must be in YYYY-MM-DD format' });
      return;
   }

   try {
      const newExpense = await prisma.expense.create({
         data: {
         amount,
         category,
         date: new Date(date),
         userId,
         },
      });
      res.status(201).json(newExpense);
   } catch (error) {
      res.status(500).json({ error: 'Failed to save expense' });
   }
});

app.get('/expenses', authenticateToken, async (req: AuthRequest, res: Response) => {
   const userId = req.user?.userId;
   if (!userId) {
      res.status(401).json({ error: 'Unauthorized: User ID not found' });
      return;
   }

   try {
      const userExpenses = await prisma.expense.findMany({
         where: { userId },
      });
      res.json(userExpenses);
   } catch (error) {
      res.status(500).json({ error: 'Failed to fetch expenses' });
   }
});

const registerHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
   const { email, password } = req.body;
   if (!email || !password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
   }

   try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
         res.status(400).json({ error: 'Email already exists' });
         return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
         data: {
         email,
         password: hashedPassword,
         },
      });
      res.status(201).json({ message: 'User registered successfully' });
   } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
   }
};

app.post('/register', registerHandler);

const loginHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
   const { email, password } = req.body;
   if (!email || !password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
   }

   try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
         res.status(401).json({ error: 'Invalid email or password' });
         return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         res.status(401).json({ error: 'Invalid email or password' });
         return;
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
   } catch (error) {
      res.status(500).json({ error: 'Login failed' });
   }
};

app.post('/login', loginHandler);

const profileHandler: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
   const userId = req.user?.userId;
   const { income, debts, savingsGoals } = req.body;

   if (!userId) {
      res.status(401).json({ error: 'Unauthorized: User ID not found' });
      return;
   }

   try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
         res.status(404).json({ error: 'User not found' });
         return;
      }

      // Update income
      if (income !== undefined) {
         await prisma.user.update({
         where: { id: userId },
         data: { income },
         });
      }

      // Update debts
      if (debts !== undefined) {
         // Delete existing debts
         await prisma.debt.deleteMany({ where: { userId } });
         // Create new debts
         if (debts.length > 0) {
         await prisma.debt.createMany({
            data: debts.map((debt: { amount: number; interestRate: number }) => ({
               userId,
               amount: debt.amount,
               interestRate: debt.interestRate,
            })),
         });
         }
      }

      // Update savings goals
      if (savingsGoals !== undefined) {
         // Delete existing savings goals
         await prisma.savingsGoal.deleteMany({ where: { userId } });
         // Create new savings goals
         if (savingsGoals.length > 0) {
         await prisma.savingsGoal.createMany({
            data: savingsGoals.map((goal: { amount: number; targetDate: string }) => ({
               userId,
               amount: goal.amount,
               targetDate: new Date(goal.targetDate),
            })),
         });
         }
      }

      res.json({ message: 'Profile updated successfully' });
   } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
   }
};

app.post('/profile', authenticateToken, profileHandler);

const getProfileHandler: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
   const userId = req.user?.userId;
   if (!userId) {
      res.status(401).json({ error: 'Unauthorized: User ID not found' });
      return;
   }

   try {
      const user = await prisma.user.findUnique({
         where: { id: userId },
         include: {
         debts: true,
         savingsGoals: true,
         },
      });

      if (!user) {
         res.status(404).json({ error: 'User not found' });
         return;
      }

      const userData = {
         income: user.income || 0,
         debts: user.debts.map(debt => ({
         amount: debt.amount,
         interestRate: debt.interestRate,
         })) || [],
         savingsGoals: user.savingsGoals.map(goal => ({
         amount: goal.amount,
         targetDate: goal.targetDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD
         })) || [],
      };

      res.json(userData);
   } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profile' });
   }
};

app.get('/profile', authenticateToken, getProfileHandler);

const adviceHandler: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
   const userId = req.user?.userId;
   if (!userId) {
      res.status(401).json({ error: 'Unauthorized: User ID not found' });
      return;
   }

      try {
         const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
            expenses: true,
            debts: true,
            savingsGoals: true,
            },
         });

         if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
         }

         const userExpenses = user.expenses;
         const totalExpenses = userExpenses.reduce((sum, e) => {
            const amount = typeof e.amount === 'number' && !isNaN(e.amount) ? e.amount : 0;
            return sum + amount;
         }, 0);
         const income = typeof user.income === 'number' && !isNaN(user.income) ? user.income : 0;
         const disposableIncome = income - totalExpenses;

         const debts = user.debts;
         const savingsGoals = user.savingsGoals;

         let prompt = `You are a financial advisor. The user has `;
         if (typeof user.income === 'number' && !isNaN(user.income)) {
            prompt += `a monthly income of $${user.income}, `;
         } else {
            prompt += `a monthly income that is not specified (assume $0 for calculations), `;
         }
         const safeTotalExpenses = typeof totalExpenses === 'number' && !isNaN(totalExpenses) ? totalExpenses : 0;
         prompt += `monthly expenses of $${safeTotalExpenses}, `;
         const safeDisposableIncome = typeof disposableIncome === 'number' && !isNaN(disposableIncome) ? disposableIncome : (user.income || 0);
         if (safeDisposableIncome >= 0) {
            prompt += `and disposable income of $${safeDisposableIncome}. `;
         } else {
            prompt += `and is overspending by $${Math.abs(safeDisposableIncome)}. `;
         }
         if (debts.length > 0) {
            const totalDebt = debts.reduce((sum, d) => {
            const amount = typeof d.amount === 'number' && !isNaN(d.amount) ? d.amount : 0;
            return sum + amount;
            }, 0);
            prompt += `They have debts totaling $${totalDebt}. `;
         }
         if (savingsGoals.length > 0) {
            const totalGoals = savingsGoals.reduce((sum, g) => {
            const amount = typeof g.amount === 'number' && !isNaN(g.amount) ? g.amount : 0;
            return sum + amount;
            }, 0);
            prompt += `They have savings goals totaling $${totalGoals}. `;
         }
         if (safeTotalExpenses > 0) {
            prompt += `Their expenses are categorized as: `;
            const categories = [...new Set(userExpenses.map(e => e.category))];
            categories.forEach(category => {
            const categoryTotal = userExpenses
               .filter(e => e.category === category)
               .reduce((sum, e) => {
                  const amount = typeof e.amount === 'number' && !isNaN(e.amount) ? e.amount : 0;
                  return sum + amount;
               }, 0);
            prompt += `${category}: $${categoryTotal}, `;
            });
            prompt = prompt.slice(0, -2);
            prompt += `. `;
         }
         prompt += `In 3-4 sentences, suggest how to allocate their disposable income between debt repayment and savings as percentages (if available), calculate how many months it will take to pay off the debt and reach the savings goal based on this allocation (if available). If they have expenses, also suggest percentage reductions in at least two or more specific expense categories (if available) to help reach their goals faster, specifying the dollar amount saved. If they are overspending, focus the advice on reducing expenses to create disposable income first. If they have no debt, suggest investment options for their disposable income.`;

         const apiKey = process.env.XAI_API_KEY;
         if (!apiKey) {
            res.status(500).json({ error: 'xAI API key not set' });
            return;
         }

         try {
            const response = await axios.post(
            'https://api.x.ai/v1/chat/completions',
            {
               model: 'grok-3-mini-fast-beta',
               messages: [
                  { role: 'user', content: prompt },
               ],
               max_tokens: 1500,
               temperature: 0.7,
            },
            {
               headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
               },
            }
         );

         const advice = response.data.choices[0]?.message?.content || 'No advice generated.';
         res.json({ advice });
      } catch (error) {
         console.error('Error generating advice:', error);
         res.status(500).json({ error: 'Failed to generate advice' });
      }
   } catch (error) {
      console.error('Error in adviceHandler:', error);
      res.status(500).json({ error: 'Failed to process advice request' });
   }
};

app.post('/advice', authenticateToken, adviceHandler);

app.listen(3001, () => console.log('Server running on port 3001'));