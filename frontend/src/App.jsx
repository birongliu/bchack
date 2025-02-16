import CameraModule from "./components/cameraModule.jsx";
import VoiceModule from "./components/voiceModule.jsx";
// import Canvas from "./components/canvas.jsx";
import BudgetOverview from "./components/BudgetOverview.jsx";
import ExpenseCategories from "./components/ExpenseCategories.jsx";
import DailyExpenses from "./components/DailyExpenses.jsx";
import icon from "./assets/spindly-3.png"
function App() {
  return (
    <div className="bg-blue-200 m-10">
      <div className="space-y-6">
        <img width={70} height={150} src={icon}></img>
        <CameraModule />
        <VoiceModule />
        <BudgetOverview />
        <ExpenseCategories />
        <DailyExpenses />
      </div>
    </div>
  );
}

export default App;