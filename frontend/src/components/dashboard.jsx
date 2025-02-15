import PropTypes from 'prop-types';

function Dashboard({ expenses }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-bold mb-2">Charts</h3>
          {/* Placeholder for charts */}
          <div className="h-40 bg-gray-200 rounded flex items-center justify-center">
            Chart Placeholder
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2">Items (Details)</h3>
          <ul className="space-y-2">
            {expenses.map((expense) => (
              <li key={expense.id} className="flex justify-between">
                <span>{expense.category}</span>
                <span>${expense.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Dashboard;
