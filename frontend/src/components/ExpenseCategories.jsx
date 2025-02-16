import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseCategories = () => {
  const [expenseData, setExpenseData] = useState(null);

  useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/eb1a72ae-21bd-42e8-b10d-6b113c97f462/expense-categories`
    )
      .then((response) => response.json())
      .then((data) => setExpenseData(data.result))
      .catch((error) =>
        console.error("Error fetching expense categories:", error)
      );
  }, []);

  if (!expenseData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Define expense categories with display labels and associated colors.
  const categories = [
    { key: "Food & Dining", label: "Dining", color: "#f87171" },
    { key: "Transportation", label: "Transportation", color: "#60a5fa" },
    { key: "Entertainment", label: "Entertainment", color: "#facc15" },
    { key: "Groceries", label: "Groceries", color: "#34d399" },
    { key: "Utilities Bills", label: "Utilities & Bills", color: "#a78bfa" },
    { key: "Others", label: "Others", color: "#f472b6" },
  ];

  
  // Calculate the total expense.
  const totalExpense = Object.values(expenseData).reduce((sum, value) => sum + value, 0);

  // Prepare the data for the Pie Chart.
  const chartData = {
    labels: categories.map((cat) => cat.label),
    datasets: [
      {
        data: categories.map((cat) => expenseData[cat.key]),
        backgroundColor: categories.map((cat) => cat.color),
        hoverBackgroundColor: categories.map((cat) => cat.color),
      },
    ],
  };

  // Calculate percentages and format values for each category.
  const categoryPercentages = categories.map((cat) => ({
    ...cat,
    value: expenseData[cat.key],
    percentage: totalExpense > 0 ? ((expenseData[cat.key] / totalExpense) * 100).toFixed(0) : 0,
  }));
  
  return (
    <div className="p-4">
      <h2 className="text-center text-lg font-bold mb-4">Expense Categories</h2>
      {/* Pie Chart Sub-component */}
      <div className="mb-4">
        <Pie
          data={chartData}
          options={{
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
          }}
          className="w-full h-40"
        />
      </div>
      
      {/* Expense Categories Items */}
      <div className="grid grid-cols-3 gap-4">
        {categoryPercentages.map((cat) => (
          <div key={cat.key} className="flex flex-col items-center justify-center border p-2 rounded">
            <div className="flex items-center">
              {/* Colored icon representing the category */}
              <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: cat.color }}></div>&nbsp;
              <p className="text-xs font-semibold">{cat.label}</p>
            </div>
            <p className="text-[10px]">
        
              {cat.percentage}% (${cat.value.toFixed(2)})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseCategories;
