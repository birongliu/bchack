// DailyExpenses.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DailyExpenses = () => {
  const [expensesData, setExpensesData] = useState(null);

  useEffect(() => {
    // Replace 'user-123' with the actual user id if needed.
    fetch('https://run.mocky.io/v3/e4705d33-2b6a-4f02-aaf1-be7d7a802623')
      .then((response) => response.json())
      .then((data) => setExpensesData(data))
      .catch((error) => console.error('Error fetching daily expenses:', error));
  }, []);

  if (!expensesData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Convert the fetched data into arrays sorted by date.
  const dates = Object.keys(expensesData).sort(
    (a, b) => new Date(a) - new Date(b)
  );
  const values = dates.map((date) => expensesData[date]);

  // Prepare the data for the Bar Chart.
  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Daily Expenses',
        data: values,
        backgroundColor: '#60a5fa', // Blue color
        borderColor: '#3b82f6',
        borderWidth: 1,
        // Narrow bars:
        barPercentage: 0.5,
        categoryPercentage: 0.5,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 5,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="p-4 m-4 max-w-screen-sm mx-auto">
      <h2 className="text-center text-lg font-bold mb-4">Daily Expenses</h2>
      {/* Bar Chart Sub-component */}
      <div className="mb-4">
        <div className="w-full h-40">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
      
      {/* Beautiful Table Sub-component */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Expense</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dates.map((date) => (
              <tr key={date} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-600">{date}</td>
                <td className="px-4 py-2 text-sm text-gray-600">${expensesData[date].toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyExpenses;
