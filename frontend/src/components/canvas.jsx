import PropTypes from "prop-types";
import { useRef, useState } from "react";

const recipientData = (response) => ({
  store_name: response.store_name,
  date: response.date,
  items: response.items.map((item) => ({
    name: item.name,
    price: item.price,
  })),
});

const Canvas = ({ videoRef }) => {
  const canvasRef = useRef(null);
  const [recipient, setRecipient] = useState(null);
  const convertCanvasToBase64 = () => {
    const canvas = canvasRef.current;
    const base64Images = canvas.toDataURL("image/jpeg");
    return base64Images;
  };
  const takePicture = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (videoRef.current && videoRef.current.readyState === 4) {
      // Clear the canvas before drawing
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the video on the canvas without mirroring
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    }
  };

  async function makeInference(image) {
    console.log(image);
    const f = await fetch(
      `${import.meta.env.VITE_API_URL}/image-to-text`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: image }),
      }
    );
    const data = await f.json();
    if (data.status === 500) {
      console.log("Error in making inference");
      return;
    }
    const response = JSON.parse(data.result);
    console.log(response);
    setRecipient(recipientData(response));
  }
  return (
    <div className="">
      <div className="">
        <video
          autoPlay
          controls={false}
          muted
          role="img"
          playsInline
          style={{
            width:"640",
          height:"480",
          }}
          ref={videoRef}
        />
        <canvas
          hidden
          ref={canvasRef}
          width="640"
          height="480"
          className="absolute inset-0"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <button
          onClick={async () => {
            console.log("clicked");
            takePicture();
            await makeInference(convertCanvasToBase64());
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 
                     transition-colors duration-200 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:ring-offset-2"
        >
          Take Picture
        </button>
      </div>

      {recipient && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{recipient.store_name}</h2>
          <p className="text-gray-600 mb-2">Date: {recipient.date}</p>
          <div className="space-y-2">
            {recipient.items?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b"
              >
                <span className="text-gray-800">{item.name}</span>
                <span className="font-medium">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

Canvas.propTypes = {
  videoRef: PropTypes.shape({
    current: PropTypes.shape({
      readyState: PropTypes.number,
      srcObject: PropTypes.object,
    }),
  }).isRequired,
};

export default Canvas; // Changed from Video to Canvas
