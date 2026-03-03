import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Typography } from '@mui/material';
import { Expense, expenseCategories } from '../types';
import { getCategoryTotals } from '../utils/expenseUtils';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SpendingChartProps {
   expenses: Expense[];
}

const SpendingChart: React.FC<SpendingChartProps> = ({ expenses }) => {
   const categoryTotals = getCategoryTotals(expenses);
   const labels = expenseCategories.filter((cat) => categoryTotals[cat] > 0);
   const data = labels.map((cat) => categoryTotals[cat]);

   const chartData = {
      labels,
      datasets: [
         {
         label: 'Spending by Category ($)',
         data,
         backgroundColor: [
            'rgba(0, 255, 255, 0.7)', 
            'rgba(255, 0, 255, 0.7)', 
            'rgba(0, 255, 0, 0.7)',   
            'rgba(255, 255, 0, 0.7)', 
            'rgba(255, 105, 180, 0.7)', 
            'rgba(75, 0, 130, 0.7)',  
            'rgba(0, 191, 255, 0.7)', 
            'rgba(255, 20, 147, 0.7)', 
            'rgba(184, 217, 62, 0.71)', 
            'rgba(138, 54, 183, 0.78)', 
            'rgba(17, 124, 17, 0.7)',
            'rgba(151, 35, 35, 0.71)', 
            'rgba(255, 0, 0, 0.78)', 
            'rgb(242, 201, 79)',
            'rgba(59, 178, 138, 0.71)', 
            'rgba(195, 141, 224, 0.78)', 
            'rgb(240, 112, 228)',
         ],
         borderColor: [
            'rgba(0, 255, 255, 0.7)', 
            'rgba(255, 0, 255, 0.7)', 
            'rgba(0, 255, 0, 0.7)',   
            'rgba(255, 255, 0, 0.7)', 
            'rgba(255, 105, 180, 0.7)', 
            'rgba(75, 0, 130, 0.7)',  
            'rgba(0, 191, 255, 0.7)', 
            'rgba(255, 20, 147, 0.7)', 
            'rgba(184, 217, 62, 0.71)', 
            'rgba(138, 54, 183, 0.78)', 
            'rgba(17, 124, 17, 0.7)',
            'rgba(151, 35, 35, 0.71)', 
            'rgba(255, 0, 0, 0.78)', 
            'rgb(242, 201, 79)',
            'rgba(59, 178, 138, 0.71)', 
            'rgba(195, 141, 224, 0.78)', 
            'rgb(240, 112, 228)',
         ],
         borderWidth: 2,
         hoverOffset: 20,
         },
      ],
   };

   const chartOptions: ChartOptions<'pie'> = {
      plugins: {
         legend: {
         labels: {
            color: '#fff',
            font: {
               size: 14,
               family: "'Roboto', sans-serif",
            },
         },
         },
         tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#0ff',
            bodyColor: '#fff',
            callbacks: {
               label: (context) => {
                  const label = context.label || '';
                  const value = context.parsed;
                  const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                  const percentage = ((value / total) * 100).toFixed(2);
                  return `${label}: $${value.toFixed(2)} (${percentage}%)`;
               },
            },
         },
      },
      animation: {
         duration: 1000,
         easing: 'easeOutCubic' as const,
      },
      maintainAspectRatio: false,
   };

   const glowAnimation = `
      @keyframes glow {
         0% {
         box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
         }
         50% {
         box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
         }
         100% {
         box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
         }
      }
   `;

   return (
      <div style={{ marginTop: '20px' }}>
         <style>{glowAnimation}</style>
            <Typography variant="h5" className="chart-title">
               Expense Spending by Category
            </Typography>
         <div
            style={{
               position: 'relative',
               height: '300px',
               background: 'rgba(10, 10, 30, 0.9)',
               borderRadius: '10px',
               padding: '10px',
               animation: 'glow 5.5s infinite',
            }}
         >
         <Pie data={chartData} options={chartOptions} />
         </div>
      </div>
   );
};

export default SpendingChart;