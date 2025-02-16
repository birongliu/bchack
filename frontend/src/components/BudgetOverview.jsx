// BudgetOverview.js
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetOverview = () => {
  const [budgetData, setBudgetData] = useState(null);

  useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/eb1a72ae-21bd-42e8-b10d-6b113c97f462/monthly-budget?month=2025-02`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setBudgetData(data.result);
      })
      .catch((error) => {
        console.error("Error fetching budget data:", error);
      });
  }, []);

  if (!budgetData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const { budget, "money_used": moneyUsed } = budgetData;
  const remaining = budget - moneyUsed;
  // Assume a 28-day month for daily budget calculations.
  const dailyBudget = (budget / 28).toFixed(2);
  // Static value for demo purposes.
  const currentDailyExpenses = 50.00;

  // Prepare the chart data.
  const chartData = {
    labels: ['Money Used', 'Remaining'],
    datasets: [
      {
        data: [moneyUsed, remaining],
        backgroundColor: ['#f87171', '#34d399'],
        hoverBackgroundColor: ['#ef4444', '#10b981'],
      },
    ],
  };

  // Chart options.
  const chartOptions = {
    cutout: '70%', // Thick doughnut ring.
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="p-4">
      <h2 className="text-center text-lg font-bold mb-4">Budget Overview</h2>
      <div className="flex flex-col items-center">
        {/* Doughnut Chart */}
        <div className="relative w-40 h-40 mb-4">
          <Doughnut data={chartData} options={chartOptions} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-sm font-semibold">${remaining.toFixed(2)}</p>
            <p className="text-xs">Remaining</p>
          </div>
        </div>
        <br />
        {/* Budget Details */}
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="flex flex-col items-center justify-center border p-2 rounded">
            <p className="text-xs font-medium">Monthly Budget</p>
            <p className="text-base font-semibold">${budget.toFixed(2)}</p>
          </div>
          <div className="flex flex-col items-center justify-center border p-2 rounded">
            <p className="text-xs font-medium">Daily Budget</p>
            <p className="text-base font-semibold">${dailyBudget}</p>
          </div>
          <div className="flex flex-col items-center justify-center border p-2 rounded">
            <p className="text-xs font-medium">Weekly budget</p>
            <p className="text-base font-semibold">$250</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;
