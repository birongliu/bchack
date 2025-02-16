import { useRef, useState } from "react";
import Canvas from "./canvas.jsx";

const closeCamera = (videoRef) => {
  const stream = videoRef.current.srcObject;
  const tracks = stream.getTracks();
  tracks.forEach((track) => {
    track.stop();
  });
};

function CameraModule() {
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const initalizeCamera = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
        },
      })
      .then((stream) => {
        setIsCameraActive(true);
        videoRef.current.srcObject = stream;
      })
      .catch(() => {
        alert("Please allow camera access");
      });
  };

  const handleCameraClick = () => {
    isCameraActive ? setIsCameraActive(false) : setIsCameraActive(true);
    if (!isCameraActive) initalizeCamera();
  };

  const handleCameraCloseClick = () => {
    isCameraActive ? setIsCameraActive(false) : setIsCameraActive(true);
    closeCamera(videoRef);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div style={{ marginTop: "20px"}} className="grid gap-4">
        {isCameraActive && <Canvas videoRef={videoRef} />}
        <button
          onClick={handleCameraClick}
          style={{
            padding: "10px",
            backgroundColor: "oklch(0.707 0.165 254.624)",
            alignItems: "center",
          }}
          className={`p-4 border ${
            isCameraActive ? "hidden" : ""
          } rounded-lg hover:bg-gray-50 transition`}
        >
          <div className="font-bold">Camera</div>
        </button>
        <button
          onClick={handleCameraCloseClick}
          className={`p-4 border rounded-lg ${
            isCameraActive ? "" : "hidden"
          } hover:bg-gray-50 transition`}
        >
          <div className="font-bold">Close Camera</div>
        </button>
      </div>
    </div>
  );
}

export default CameraModule;
