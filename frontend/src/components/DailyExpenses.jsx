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
    fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/eb1a72ae-21bd-42e8-b10d-6b113c97f462/daily-expenses?startDate=02/01/2025&endDate=02/30/2025`
    )
      .then((response) => response.json())
      .then((data) => setExpensesData(data.result))
      .catch((error) => console.error("Error fetching daily expenses:", error));
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
        label: "Daily Expenses",
        data: values,
        backgroundColor: "oklch(0.546 0.245 262.881)", // Blue color
        borderColor: "#3b82f6",
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
    <div  className="p-4 md:mx-10! mt-10! mx-4!">
      <h2 className="text-center text-lg font-bold mb-4">Daily Expenses</h2>
      {/* Bar Chart Sub-component */}
      <div className="mb-4">
        <div className="w-full h-40">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
      
      {/* Beautiful Table Sub-component */}
      <div className="overflow-x-auto px- flex items-center justify-center mt-10">
        <table className="min-w-full mb-10! bg-amber-50 border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Expense</th>
            </tr>
          </thead>
          <tbody className="divide-y  divide-gray-200">
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
