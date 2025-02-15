// import Dashboard from "./components/dashboard.jsx";
// import Summary from "./components/summary.jsx";
import BudgetSection from "./components/budget.jsx";
import CameraModule from "./components/cameraModule.jsx";
import VoiceModule from "./components/voiceModule.jsx";
// import Canvas from "./components/canvas.jsx";
function App() {

  // const [budget, setBudget] = useState(1000);
  // const [expenses, setExpenses] = useState([
  //   { id: 1, category: "Food", amount: 250 },
  //   { id: 2, category: "Traffic", amount: 150 },
  //   { id: 3, category: "Entertainment", amount: 200 },
  //   { id: 4, category: "Others", amount: 100 },
  // ]);

  return (
    <div className="">
      <div className="mx-auto space-y-6">
        {/* <BudgetSection /> */}

        <CameraModule />
        {/* <Dashboard expenses={expenses} />
        <Summary budget={budget} expenses={expenses} /> */}
        {/* <ChatBox /> */}
        {/* <Canvas videoRef={videoRef} /> */}
        <span>a</span>
        <VoiceModule />
      </div>
    </div>
  );
}

export default App;

// const ChatBox = () => {
//   const [transcription, setTranscription] = useState(""); // The text inside the input box
//   const [isRecording, setIsRecording] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [showSendButton, setShowSendButton] = useState(false);


//   const initalizeVoice = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//       });
//       const mediaRecorder = new MediaRecorder(stream);
//       return mediaRecorder;
//     } catch (error) {
//       console.error("Error accessing microphone:", error);
//       return null;
//     }
//   };

//   const textAreaStyle = {
//     width: "100%",
//     border: "1px solid #ccc",
//     borderRadius: "4px",
//     marginBottom: "16px",
//     resize: "none",
//   };

//   const buttonStyle = {
//     padding: "10px 20px",
//     borderRadius: "20px",
//     border: "none",
//     cursor: "pointer",
//     color: "white",
//     fontSize: "16px",
//   };

//   const micButtonStyle = {
//     ...buttonStyle,
//     backgroundColor: isRecording ? "#e53e3e" : "#23471b",
//   };
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunksRef.current, {
//           type: "audio/wav",
//         });
//         audioChunksRef.current = []; // Clear recorded data
//         sendToBackend(audioBlob);
//       };

//       mediaRecorderRef.current = mediaRecorder;
//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch (error) {
//       console.error("Error accessing microphone:", error);
//     }
//   };
//   const sendToBackend = async (blob) => {
//     const formData = new FormData();
//     formData.append("audio", blob, "audio.wav");

//     try {
//       console.log("Sending audio...");
//       const response = await fetch(
//         "https://192.168.1.158:5000/speech-to-text",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );
//       const data = await response.json();
//       console.log("Response:", data);
//       console.log("Transcription:", data.result);
//       setTranscription(data.result);
//     } catch (error) {
//       console.error("Error sending audio:", error);
//     }
//   };
//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   // When the user presses and holds the microphone button.
//   const handleMicMouseDown = (r) => {
//     r.preventDefault();
//     setIsRecording(true);
//     setShowSendButton(false); // Hide the send button (if visible)
//     setTranscription("Recording...");
//     startRecording();
//   };

//   // When the user releases the microphone button.
//   const handleMicMouseUp = (r) => {
//     r.preventDefault();
//     setIsRecording(false);
//     setIsProcessing(true);
//     setTranscription("Processing voice...");
//     stopRecording();

//     // Simulate a 2-second processing delay, then update with hard-coded text.
//     setTimeout(() => {
//       // const simulatedText =
//       //   "My name is Jake. I'm male. My current weight is 200 pounds, my height is 6 feet. My goal is to lose 5 pounds in one month. I have a peanut allergy.";
//       // setTranscription(simulatedText);
//       setIsProcessing(false);
//       setShowSendButton(true);
//     }, 2000);
//   };

//   return (
//     <div>
//       {/* Input box (textarea) for transcription */}
//       <textarea
//         style={textAreaStyle}
//         rows="4"
//         value={transcription}
//         readOnly
//         onChange={(e) => setTranscription(e.target.value)}
//         placeholder="Your transcription will appear here..."
//       />

//       {/* Microphone button */}
//       <div
//         style={{ color: "green", textAlign: "center", marginBottom: "16px" }}
//       >
//         <button
//           style={micButtonStyle}
//           onMouseDown={handleMicMouseDown}
//           onMouseUp={handleMicMouseUp}
//           onTouchStart={handleMicMouseDown}
//           onTouchEnd={handleMicMouseUp}
//         >
//           {isRecording ? "Recording..." : "Hold to Record"}
//         </button>
//       </div>
//     </div>
//   );
// };
