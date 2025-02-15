"use client";
import { useState } from "react";
import PropTypes from "prop-types";

function BudgetCard({ category, onUpdateBudget }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(category.budget.toString());

  const percentSpent = (category.spent / category.budget) * 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedBudget = Number.parseFloat(newBudget);
    if (!isNaN(updatedBudget) && updatedBudget > 0) {
      onUpdateBudget(updatedBudget);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{category.name}</h3>
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 text-gray-500 hover:text-gray-700"
          aria-label={`Edit ${category.name} budget`}
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
      </div>
      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          className="flex items-center space-x-2 mb-4"
        >
          <input
            type="number"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            className="w-full px-2 py-1 border rounded"
            min="0"
            step="10"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Set
          </button>
        </form>
      ) : (
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">
            ${category.spent.toLocaleString()} / $
            {category.budget.toLocaleString()}
          </span>
          <span className="text-sm font-medium">
            {percentSpent.toFixed(1)}%
          </span>
        </div>
      )}
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${percentSpent}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
          ></div>
        </div>
      </div>
    </div>
  );
}

BudgetCard.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    budget: PropTypes.number.isRequired,
    spent: PropTypes.number.isRequired,
  }).isRequired,
  onUpdateBudget: PropTypes.func.isRequired,
};
export default BudgetCard;