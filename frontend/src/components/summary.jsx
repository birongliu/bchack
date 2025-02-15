function Summary() {
  const handleSummary = () => {
    fetch("https://192.168.1.158:5000/summary")
  }

  return (
    <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm">Summary</div>
        </div>
        <button className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-blue-100 transition">
          See details
        </button>
      </div>
    </div>
  );
}

export default Summary;
