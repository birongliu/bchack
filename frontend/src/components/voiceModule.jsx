import { useRef, useState } from "react";

export default function VoiceModule() {
  const [isVoiceActive, setVoiceActive] = useState(false);
  function triggerVoice(prev) {
    setVoiceActive(!prev);
    console.log("Voice Active: ", !prev);
  }

  return (
    <div className="w-full! mt-5! p-4! rounded-lg! shadow">
      {isVoiceActive && <VoiceCanvas handleVoice={triggerVoice} />}
      {!isVoiceActive && (
        <button
          onClick={() => setVoiceActive(!isVoiceActive)}
          style={{
            padding: "10px",
            backgroundColor: "oklch(0.707 0.165 254.624)",
            alignItems: "center",
          }}
          className={`p-4 border ${
            isVoiceActive ? "hidden" : ""
          } rounded-lg hover:bg-gray-50 transition w-full!`}
        >
          <div className="font-bold">Voice</div>
        </button>
      )}
    </div>
  );
}


// eslint-disable-next-line react/prop-types
function VoiceCanvas({ handleVoice }) {
  console.log(handleVoice);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [__, setIsProcessing] = useState(false);
  const [_, setShowSendButton] = useState(false);
  const initializeVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mediaRecorder = new MediaRecorder(stream);
      return mediaRecorder;
    } catch (error) {
      console.error("Error accessing microphone:", error);
      return null;
    }
  };

  const startRecording = async () => {
    try {
      const mediaRecorder = await initializeVoice();
      if (mediaRecorder) {
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorderRef.current.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };
        mediaRecorderRef.current.onstop = async () => {
          setIsProcessing(true);
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          const formData = new FormData();
          formData.append("audio", audioBlob, "audio.wav");
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/speech-to-text`,
            {
              method: "POST",
              body: formData,
            }
          );
          const data = await response.json();
          console.log(data);
          setTranscription(data.result);
          setIsProcessing(false);
          audioChunksRef.current = [];
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
      }
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceClick = () => {
    setVoiceActive(!isVoiceActive);
    if (!isVoiceActive) startRecording();
    else stopRecording();
  };
  const containerStyle = {
    width: "100%",
    margin: "20px auto",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  };

  const textAreaStyle = {
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "16px",
    resize: "none",
  };

  const handleMicMouseDown = (r) => {
    r.preventDefault();
    setIsRecording(true);
    setShowSendButton(false); // Hide the send button (if visible)
    setTranscription("Recording...");
    startRecording();
  };
  const handleMicMouseUp = (r) => {
    r.preventDefault();
    setIsRecording(false);
    setIsProcessing(true);
    setTranscription("Processing voice...");
    stopRecording();

    // Simulate a 2-second processing delay, then update with hard-coded text.
    setTimeout(() => {
      // const simulatedText =
      //   "My name is Jake. I'm male. My current weight is 200 pounds, my height is 6 feet. My goal is to lose 5 pounds in one month. I have a peanut allergy.";
      // setTranscription(simulatedText);
      setIsProcessing(false);
      setShowSendButton(true);
    }, 2000);
  };

  return (
    <div style={containerStyle}>
      {/* Input box (textarea) for transcription */}
      <textarea
        style={textAreaStyle}
        rows="4"
        value={transcription}
        readOnly
        onChange={(e) => setTranscription(e.target.value)}
        placeholder="Your transcription will appear here..."
      />

      {/* Microphone button */}
      <div
        style={{ color: "green", textAlign: "center", marginBottom: "16px" }}
      >
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: isRecording ? "red" : "green",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onMouseDown={handleMicMouseDown}
          onMouseUp={handleMicMouseUp}
          onTouchStart={handleMicMouseDown}
          onTouchEnd={handleMicMouseUp}
        >
          {isRecording ? "Recording..." : "Hold to Record"}
        </button>
      </div>
      <div
        style={{ color: "green", textAlign: "center", marginBottom: "16px" }}
      >
        <button
          onClick={() => {
            handleVoice((prev) => !prev);
            stopRecording();
          }}
          style={{
            padding: "8px 16px",
            backgroundColor: isRecording ? "red" : "green",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}