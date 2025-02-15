import { useRef, useState } from "react";

export default function VoiceModule() {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [isVoiceActive, setVoiceActive] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const initializeVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold">Voice</div>
            <div className="text-sm text-gray-600">Assistant</div>
          </div>
          <button
            onClick={handleVoiceClick}
            className={`p-4 border rounded-lg hover:bg-gray-50 transition ${
              isRecording ? "bg-red-500 text-white" : ""
            }`}
          >
            {isRecording ? "Stop" : "Voice"}
          </button>
        </div>
        {isProcessing && <div>Processing...</div>}
        {transcription && <div>{transcription}</div>}
      </div>
    </div>
  );
}
