import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function ExpenseChart({ expenses }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (expenses.length > 0) {
      const categories = {};
      expenses.forEach((expense) => {
        if (categories[expense.category]) {
          categories[expense.category] += expense.amount;
        } else {
          categories[expense.category] = expense.amount;
        }
      });

      const chartData = {
        labels: Object.keys(categories),
        datasets: [
          {
            data: Object.values(categories),
            backgroundColor: [
              '#FF6384', // Red
              '#36A2EB', // Blue
              '#FFCE56', // Yellow
              '#4BC0C0', // Teal
              '#9966FF', // Purple
            ],
          },
        ],
      };

      const ctx = chartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: chartData,
      });
    }
  }, [expenses]);

  return <canvas ref={chartRef} />;
}