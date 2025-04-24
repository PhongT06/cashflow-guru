# CashFlow Guru

CashFlow Guru is a financial management application designed to help users track their income, expenses, debts, and savings goals. It provides personalized financial advice using AI to help users make informed decisions about their finances.

## Features

- **User Authentication**: Secure user registration and login with JWT-based authentication.
- **Income Tracking**: Record and update monthly income.
- **Expense Tracking**: Categorize and track expenses with detailed summaries and visualizations.
- **Debt Management**: Add and manage debts with interest rates.
- **Savings Goals**: Set and track savings goals with target dates.
- **Financial Advice**: Receive AI-generated advice on debt repayment, savings allocation, and expense reduction.
- **Data Visualization**: View spending summaries and charts for better financial insights.

## Project Structure

```
cashflow_guru/
├── client/                # Frontend React application
│   ├── public/            # Static assets (HTML, icons, etc.)
│   ├── src/               # React source code
│   │   ├── components/    # React components
│   │   ├── utils/         # Utility functions
│   │   ├── styles.css     # Global styles
│   │   ├── types.ts       # TypeScript types
│   └── package.json       # Frontend dependencies and scripts
├── server/                # Backend Node.js application
│   ├── prisma/            # Prisma schema and migrations
│   ├── index.ts           # Express server entry point
│   └── package.json       # Backend dependencies and scripts
├── package.json           # Root project scripts
└── .gitignore             # Ignored files for version control
```

## Technologies Used

### Frontend
- **React**: For building the user interface.
- **Material-UI**: For responsive and modern UI components.
- **Chart.js**: For data visualization.
- **TypeScript**: For type safety.

### Backend
- **Node.js**: For the server runtime.
- **Express**: For building the REST API.
- **Prisma**: For database ORM.
- **PostgreSQL**: As the database.
- **JWT**: For secure authentication.
- **bcrypt.js**: For password hashing.

### AI Integration
- **xAI API**: For generating personalized financial advice.

## Installation

### Prerequisites
- Node.js (v18.x or higher)
- PostgreSQL database
- npm or yarn

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/PhongT06/cashflow_guru.git
   cd cashflow_guru
   ```

2. Install dependencies for both the client and server:
   ```sh
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database.
   - Update the `DATABASE_URL` in `server/.env` with your database connection string.
   - Run Prisma migrations:
     ```sh
     cd server
     npx prisma migrate deploy
     ```

4. Start the development servers:
   ```sh
   npm run start
   ```

   This will start both the client (React) and server (Node.js) applications.

5. Open the application in your browser:
   ```
   http://localhost:3000
   ```

## Scripts

### Root
- `npm run start`: Starts both the client and server concurrently.

### Client
- `npm start`: Starts the React development server.
- `npm run build`: Builds the React app for production.
- `npm test`: Runs tests for the React app.

### Server
- `npm run dev`: Starts the server in development mode with `ts-node`.
- `npm run build`: Compiles TypeScript to JavaScript.
- `npm run start`: Starts the compiled server.

## Environment Variables

### Server
Create a `.env` file in the server directory with the following variables:
```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
XAI_API_KEY=your_xai_api_key
```

## Usage

1. Register a new account or log in with an existing one.
2. Add your income, expenses, debts, and savings goals.
3. View your financial overview and receive personalized advice.
4. Use the tracker to visualize your spending and progress toward financial goals.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Prisma](https://www.prisma.io/)
- [Chart.js](https://www.chartjs.org/)
- [xAI API](https://www.x.ai/)
