import React, { useEffect, useRef, useState } from "react";

// Declare faceapi as a global variable since it's loaded dynamically
declare const faceapi: any;

const FaceDetection: React.FC = () => {
  // References to the video and canvas elements in the DOM
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Reference to store the interval ID for face detection
  const intervalRef = useRef<number | null>(null);
  // State to store the detected facial expression
  const [faceExpressions, setFaceExpressions] = useState<string>("");

  useEffect(() => {
    // Function to dynamically load the face-api script
    const loadFaceApiScript = () => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "/face-api.min.js"; // Path to the face-api script
        script.async = true;
        script.onload = () => {
          resolve(); // Resolve the promise when the script loads
        };
        script.onerror = () => {
          reject(new Error("Failed to load face-api.min.js")); // Reject if there's an error
        };
        document.body.appendChild(script); // Append the script to the document body
      });
    };

    // Function to load the necessary face-api models
    const loadModels = async () => {
      const MODEL_URL = "/models"; // Path to the models directory
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL), // Load Tiny Face Detector model
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL), // Load Face Landmark model
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL), // Load Face Recognition model
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL), // Load Face Expression model
      ]);
      startVideo(); // Start the video stream after models are loaded
    };

    // Function to start the video stream from the user's webcam
    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: {} }) // Request access to the webcam
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream; // Set the video source to the webcam stream
          }
        })
        .catch((err) => console.error("Error accessing webcam: ", err)); // Log any errors
    };

    // Initialize face-api by loading the script and models
    const initializeFaceApi = async () => {
      try {
        await loadFaceApiScript(); // Load the face-api script dynamically
        await loadModels(); // Load the required models
      } catch (error) {
        console.error("Error initializing face-api:", error); // Log any errors during initialization
      }
    };

    initializeFaceApi(); // Call the initialization function

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // Clear the interval
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    console.log("Face Expression Updated:", faceExpressions);
    // Additional actions can be performed whenever faceExpressions changes
  }, [faceExpressions]); // Run this effect whenever faceExpressions updates

  // Function to handle the video playback event
  const handleVideoOnPlay = () => {
    if (videoRef.current && canvasRef.current && faceapi) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set the canvas dimensions to match the video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Define the display size based on the video dimensions
      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };

      // Match the canvas dimensions with the display size
      faceapi.matchDimensions(canvas, displaySize);

      // Set up an interval to perform face detection periodically
      intervalRef.current = window.setInterval(async () => {
        // Detect faces, landmarks, and expressions in the video stream
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        // Resize the detections to match the display size
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        const context = canvas.getContext("2d");
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
          faceapi.draw.drawDetections(canvas, resizedDetections); // Draw face detections
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections); // Draw face landmarks
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections); // Draw face expressions
        }

        if (resizedDetections.length > 0) {
          const expressions = resizedDetections[0].expressions; // Get expressions of the first detected face
          let maxValue = -Infinity;
          let dominantExpression = "";

          // Iterate over the expressions to find the one with the highest value
          for (const [expression, value] of Object.entries(expressions)) {
            if (typeof value === "number" && value > maxValue) {
              maxValue = value; // Update maxValue if a higher value is found
              dominantExpression = expression; // Set the dominant expression
            }
          }

          setFaceExpressions(dominantExpression); // Update the state with the dominant expression
          console.log("Dominant Expression:", dominantExpression); // Log the dominant expression
        } else {
          // If no face is detected, reset the expression
          setFaceExpressions("");
        }
      }, 100); // Repeat every 100 milliseconds
    }
  };

  return (
    <div className='relative h-screen'>
      {/* Video element to display the webcam feed */}
      <video
        ref={videoRef}
        className=' h-full object-cover w-full'
        autoPlay
        muted
        onPlay={handleVideoOnPlay} // Start face detection when the video plays
      />
      {/* Canvas element for drawing detections, hidden from view */}
      <canvas ref={canvasRef} className='hidden' />
      {/* Display the detected facial expression */}
      <div className='absolute top-0 left-0 p-4 text-white'>
        {faceExpressions && <h1>Expression: {faceExpressions}</h1>}
      </div>
    </div>
  );
};

export default FaceDetection;
