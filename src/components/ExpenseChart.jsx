import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function ExpenseChart({ expenses }) {
  const chartRef = useRef(null); // Ref for the canvas element
  const chartInstance = useRef(null); // Ref to store the chart instance

  useEffect(() => {
    if (expenses.length > 0) {
      // Calculate category totals
      const categories = {};
      expenses.forEach((expense) => {
        if (categories[expense.category]) {
          categories[expense.category] += expense.amount;
        } else {
          categories[expense.category] = expense.amount;
        }
      });

      // Prepare chart data
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

      // Get the canvas context
      const ctx = chartRef.current.getContext('2d');

      // Destroy the previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create a new chart instance
      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: chartData,
      });
    }

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [expenses]); // Re-run the effect when `expenses` changes

  return <canvas ref={chartRef} />;
}