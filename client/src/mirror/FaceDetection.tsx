import React, { useEffect, useRef, useState } from "react";
import "./FaceDetection.css";

declare const faceapi: any;

const FaceDetection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<number | null>(null);

  const [faceExpressions, setFaceExpressions] = useState<string>("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [blitz, setBlitz] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null); // State for image data
  const [showPreview, setShowPreview] = useState(false); // State to control preview visibility

  useEffect(() => {
    const loadFaceApiScript = () => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "/face-api.min.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load face-api.min.js"));
        document.body.appendChild(script);
      });
    };

    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      startVideo();
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Error accessing webcam: ", err));
    };

    const initializeFaceApi = async () => {
      try {
        await loadFaceApiScript();
        await loadModels();
      } catch (error) {
        console.error("Error initializing face-api:", error);
      }
    };

    initializeFaceApi();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log("Face Expression Updated:", faceExpressions);
  }, [faceExpressions]);

  const handleVideoOnPlay = () => {
    if (videoRef.current && canvasRef.current && faceapi) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      intervalRef.current = window.setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        const context = canvas.getContext("2d");
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }

        if (resizedDetections.length > 0) {
          const expressions = resizedDetections[0].expressions;
          let maxValue = -Infinity;
          let dominantExpression = "";

          for (const [expression, value] of Object.entries(expressions)) {
            if (typeof value === "number" && value > maxValue) {
              maxValue = value;
              dominantExpression = expression;
            }
          }

          setFaceExpressions(dominantExpression);
        } else {
          setFaceExpressions("");
        }
      }, 100);
    }
  };

  // Function to handle the screenshot logic
  const takeScreenshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");

      // Set canvas dimensions to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame on the canvas
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert the canvas to a data URL (image) and store it
        const img = canvas.toDataURL("image/png");
        setImageData(img);
        setShowPreview(true); // Show the image preview
      }
    }
  };

  const disableScreenshotButton = () => {
    const button = document.querySelector("#scrnsht_btn");
    if (button) {
      button.setAttribute("disabled", "true");
    }
  }

  const enableScreenshotButton = () => {
    const button = document.querySelector("#scrnsht_btn");
    if (button) {
      button.removeAttribute("disabled");
    }
  }
  // Function to start the countdown and take a screenshot after 3 seconds
  const startCountdown = () => {
    setCountdown(3);
    disableScreenshotButton(); // Disable the screenshot button during countdown
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown && prevCountdown > 1) {
          return prevCountdown - 1;
        } else {
          clearInterval(interval);
          setCountdown(null);
          triggerBlitzEffect();
          takeScreenshot(); // Call to take screenshot
          enableScreenshotButton();
          return null;
        }
      });
    }, 1000);
  };

  const triggerBlitzEffect = () => {
    setBlitz(true);
    setTimeout(() => setBlitz(false), 500);
  };

  // Function to handle user confirmation for using the screenshot
  const handleConfirmScreenshot = () => {
    const link = document.createElement("a");
    link.href = imageData!;
    link.download = "smArt_mirror_screenshot.png";
    link.click();
    setShowPreview(false); // Hide the preview after confirming
    setImageData(null); // Clear the image data
  };

  // Function to handle cancellation of the screenshot
  const handleCancelScreenshot = () => {
    setShowPreview(false); // Hide the preview
    setImageData(null); // Clear the image data
  };

  return (
    <div className={`relative h-screen ${blitz ? "blitz-effect" : ""}`}>
      <video
        ref={videoRef}
        className="object-cover w-full h-full"
        autoPlay
        muted
        onPlay={handleVideoOnPlay}
        style={{ transform: "scaleX(-1)" }}
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute top-0 left-0 p-4 text-white bg-black">
        <h1>Expression: {faceExpressions}</h1>
      </div>
      {countdown !== null && (
        <div className="absolute p-4 text-white transform -translate-x-1/2 -translate-y-1/2 text-9xl top-1/2 left-1/2">
          {countdown}
        </div>
      )}
      <div className="absolute bottom-0 left-0 p-4">
        <button
          id="scrnsht_btn" 
          className="p-2 text-white bg-blue-500"
          onClick={startCountdown}
        >
          Capture photo
        </button>
      </div>

      {/* Image Preview and Confirmation */}
      {showPreview && imageData && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-4 bg-white rounded">
            <img src={imageData} alt="Screenshot Preview" className="mb-4" />
            <h2>Would you like to submit this image?</h2>
            <div className="flex justify-end gap-3">
              <button
                className="p-2 text-white bg-blue-500"
                onClick={handleConfirmScreenshot}
              >
                Yes
              </button>
              <button
                className="p-2 text-white bg-red-500"
                onClick={handleCancelScreenshot}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceDetection;
