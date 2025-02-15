import { useState } from "react";

// Initial sample data
const initialBudgetData = {
  totalBudget: 100,
  spent: 100,
  categories: [
    { name: "Housing", budget: 2000, spent: 100 },
    { name: "Food", budget: 800, spent: 1 },
    { name: "Transportation", budget: 400, spent: 1 },
    { name: "Utilities", budget: 300, spent: 1 },
    { name: "Entertainment", budget: 200, spent: 1 },
  ],
};

export default function BudgetSection() {
  const [budgetData, setBudgetData] = useState(initialBudgetData);
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [newTotalBudget, setNewTotalBudget] = useState(
    budgetData.totalBudget.toString()
  );

  const percentSpent = (budgetData.spent / budgetData.totalBudget) * 100;

  const handleTotalBudgetSubmit = (e) => {
    e.preventDefault();
    const newTotal = Number.parseFloat(newTotalBudget);
    if (!isNaN(newTotal) && newTotal > 0) {
      setBudgetData((prev) => ({
        ...prev,
        totalBudget: newTotal,
        categories: prev.categories.map((cat) => ({
          ...cat,
          budget: (cat.budget / prev.totalBudget) * newTotal,
        })),
      }));
      setIsEditingTotal(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className=" shadow rounded-lg m-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                clipRule="evenodd"
              />
            </svg>
            {isEditingTotal ? (
              <form
                onSubmit={handleTotalBudgetSubmit}
                className="flex items-center space-x-2"
              >
                <input
                  type="number"
                  value={newTotalBudget}
                  onChange={(e) => setNewTotalBudget(e.target.value)}
                  className="w-32 px-2 py-1 border rounded"
                  min="0"
                  step="100"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Set
                </button>
              </form>
            ) : (
              <>
                <span className="text-2xl font-bold">
                  ${budgetData.totalBudget.toLocaleString()}
                </span>
                <button
                  onClick={() => setIsEditingTotal(true)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  aria-label="Edit total budget"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Spent: ${budgetData.spent.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              Remaining: $
              {(budgetData.totalBudget - budgetData.spent).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${percentSpent}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
            ></div>
          </div>
        </div>
        <p className="text-sm text-gray-600 text-right">
          {percentSpent.toFixed(1)}% spent
        </p>
      </div>
    </section>
  );
}
