import React, { useEffect, useRef, useState } from "react";
import "./FaceDetection.css";
import html2canvas from "html2canvas";

declare const faceapi: any;

const FaceDetection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<number | null>(null);

  const [faceExpressions, setFaceExpressions] = useState<string>("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [blitz, setBlitz] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null); 
  const [showPreview, setShowPreview] = useState(false); 
  const [showMoodPreview, setShowMoodPreview] = useState(false);
  const [moodImageData, setMoodImageData] = useState<string | null>(null); 

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


  const takeMoodBasedScreenshot = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;

        // Create a canvas for the video frame
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");
        if (context) {
            context.save();
            context.scale(-1, 1); // Flip the video horizontally
            context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
            context.restore();

            // Use html2canvas to capture the specific HTML element
            const elementToCapture = document.getElementById("specific");

            if (elementToCapture) {
              elementToCapture.style.opacity = "1"; 
                // Capture with allowTaint set to true
                html2canvas(elementToCapture, { allowTaint: true, backgroundColor: null  }).then((elementCanvas) => {
                    const elementContext = elementCanvas.getContext("2d");
                    if (elementContext) {
                        // Draw the captured element on the original canvas
                        context.drawImage(elementCanvas, 0, 0); // Adjust position as needed
                    }

                    // Convert to image and update state
                    const img = canvas.toDataURL("image/png");
                    setMoodImageData(img);
                    setShowMoodPreview(true); // Show the mood-based image preview
                });
                elementToCapture.style.opacity = "0"; 
            } else {
                console.error("Element to capture not found!");
            }
        }
    }
};

  const takeScreenshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
  
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  
      const context = canvas.getContext("2d");
      if (context) {
        context.save();

        context.scale(-1, 1);
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
  
        context.restore();
        
        const img = canvas.toDataURL("image/png");
        setImageData(img);
        setShowPreview(true);
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


  const startCountdown = () => {
    setCountdown(3);
    disableScreenshotButton();
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown && prevCountdown > 1) {
          return prevCountdown - 1;
        } else {
          clearInterval(interval);
          setCountdown(null);
          triggerBlitzEffect();
          takeScreenshot(); 
          enableScreenshotButton();
          return null;
        }
      });
    }, 1000);
  };

  const startCountdownMood = () => {
    setCountdown(3);
    disableScreenshotButton();
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown && prevCountdown > 1) {
          return prevCountdown - 1;
        } else {
          clearInterval(interval);
          setCountdown(null);
          triggerBlitzEffect();
          takeMoodBasedScreenshot(); 
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


  const handleConfirmScreenshot = () => {
    const link = document.createElement("a");
    link.href = imageData!;
    link.download = "smArt_mirror_screenshot.png";
    link.click();
    setShowPreview(false); 
    setImageData(null);
  };

  
  const handleCancelScreenshot = () => {
    setShowPreview(false); 
    setImageData(null); 
  };


  const handleConfirmMoodScreenshot = () => {
    const link = document.createElement("a");
    link.href = moodImageData!;
    link.download = "mood_based_screenshot.png";
    link.click();
    setShowMoodPreview(false);
    setMoodImageData(null);
  };

  const handleCancelMoodScreenshot = () => {
    setShowMoodPreview(false);
    setMoodImageData(null);
  };

  return (
    <div className={`relative h-screen ${blitz ? "blitz-effect" : ""}`}>
      <div className="absolute z-10 mt-20">
        <div className="w-[50px] h-[50px] bg-red-500" ></div>

        {faceExpressions === "happy" &&
          <img id="specific" className="w-[100px] h-[100px] opacity-0" src="/public/images/sun.png" alt="" />
        
        }

        {faceExpressions === "sad" &&
          <img id="specific" className="w-[100px] h-[100px] opacity-0" src="/public/images/rain.png" alt="" />
        
        }


        
         


      </div>
      <video
        ref={videoRef}
        className="object-cover w-full h-full inverted-video"
        autoPlay
        muted
        onPlay={handleVideoOnPlay}
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
          Capture photo (Send to AI)
        </button>
        <button
          className="p-2 ml-2 text-white bg-green-500"
          onClick={startCountdownMood}
        >
          Capture photo (Mood-based art)
        </button>
      </div>

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

{showMoodPreview && moodImageData && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-4 bg-white rounded">
            <img src={moodImageData} alt="Mood Screenshot Preview" className="mb-4" />
            <div>
              <button
                className="px-4 py-2 text-white bg-blue-500"
                onClick={handleConfirmMoodScreenshot}
              >
                Confirm Mood Screenshot
              </button>
              <button
                className="px-4 py-2 ml-2 text-gray-500"
                onClick={handleCancelMoodScreenshot}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceDetection;
