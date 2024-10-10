import React, { useEffect, useRef, useState } from "react";
import "./FaceDetection.css";
import html2canvas from "html2canvas";
import { FaCamera } from "react-icons/fa";
import ImageModal from "@/ImageModal";

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
  const [showCapturePhotoButtons, setshowCapturePhotoButtons] = useState(false);
  const [shouldPlayAudio, setShouldPlayAudio] = useState(false);
  const [expressionNotDetected, setExpressionNotDetected] = useState(false);

  useEffect(() => {
    const loadFaceApiScript = () => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "/face-api.min.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error("Failed to load face-api.min.js"));
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

  const handleVideoOnPlay = () => {
    if (videoRef.current && canvasRef.current && faceapi) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };
      faceapi.matchDimensions(canvas, displaySize);

      intervalRef.current = window.setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

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

  useEffect(() => {
    happyAudio.current.loop = true;
    sadAudio.current.loop = true;
    angryAudio.current.loop = true;
  }, []);

  useEffect(() => {
    if (shouldPlayAudio) {
      playMoodAudio();
      setShouldPlayAudio(false);
    }
  }, [shouldPlayAudio]);

  const playMoodAudio = () => {
    console.log("Playing mood audio", faceExpressions);
    if (faceExpressions === "happy") {
      console.log("Happy audio playing");
      happyAudio.current.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    } else if (faceExpressions === "sad") {
      console.log("Sad audio playing");
      sadAudio.current.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    } else if (faceExpressions === "angry") {
      console.log("Angry audio playing");
      angryAudio.current.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    }
  };
  const stopMoodAudio = () => {
    if (!happyAudio.current.paused) {
      happyAudio.current.pause();
      happyAudio.current.currentTime = 0;
    }

    if (!sadAudio.current.paused) {
      sadAudio.current.pause();
      sadAudio.current.currentTime = 0;
    }

    if (!angryAudio.current.paused) {
      angryAudio.current.pause();
      angryAudio.current.currentTime = 0;
    }
  };

  const happyAudio = useRef(new Audio("/assets/happy.mp3"));
  const sadAudio = useRef(new Audio("/assets/sad.mp3"));
  const angryAudio = useRef(new Audio("/assets/angry.mp3"));
  const takeMoodBasedScreenshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (context) {
        context.save();
        context.scale(-1, 1); // Flip the video horizontally
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        context.restore();

        const elementsToCapture = document.getElementsByClassName("specific");

        if (elementsToCapture.length > 0) {
          const positions = {
            topLeft: { x: 0, y: 0 }, // Sun position
            topRight: { x: canvas.width - 100, y: 0 }, // Boodaflais position (adjusting for width of image)
          };

          // Iterate through each element and capture it
          Array.from(elementsToCapture).forEach((element, index) => {
            const elementToCapture = element as HTMLElement; // Cast Element to HTMLElement

            elementToCapture.style.opacity = "1";

            // Capture with html2canvas
            html2canvas(elementToCapture, {
              allowTaint: true,
              backgroundColor: null,
            }).then((elementCanvas) => {
              const elementContext = elementCanvas.getContext("2d");
              if (elementContext) {
                // Adjust position based on index
                const position =
                  index === 0 ? positions.topLeft : positions.topRight;
                context.drawImage(elementCanvas, position.x, position.y); // Draw at calculated position
              }

              // Convert to image and update state
              const img = canvas.toDataURL("image/png");
              setMoodImageData(img);
              setShowMoodPreview(true);
              setShouldPlayAudio(true);

              if (img) {
                triggerBlitzEffect();
              }
            });
            elementToCapture.style.opacity = "0";
          });
        } else {
          console.error("Elements to capture not found!");
          setExpressionNotDetected(true);
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
  };

  const enableScreenshotButton = () => {
    const button = document.querySelector("#scrnsht_btn");
    if (button) {
      button.removeAttribute("disabled");
    }
  };

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
    setExpressionNotDetected(false);
    setCountdown(3);
    disableScreenshotButton();
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown && prevCountdown > 1) {
          return prevCountdown - 1;
        } else {
          clearInterval(interval);
          setCountdown(null);
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

  // SKAL BRUKES TIL Å SENDE IMG TIL BACKEND
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
    stopMoodAudio();
    const link = document.createElement("a");
    link.href = moodImageData!;
    link.download = "mood_based_screenshot.png";
    link.click();
    setShowMoodPreview(false);
    setMoodImageData(null);
  };

  const handleCancelMoodScreenshot = () => {
    stopMoodAudio();
    setShowMoodPreview(false);
    setMoodImageData(null);
  };

  const openCapturePhotoButtons = () => {
    setshowCapturePhotoButtons((prev) => !prev);
  };

  return (
    <div className={`relative h-screen ${blitz ? "blitz-effect" : ""}`}>
      <div className='absolute z-10 w-full mt-20'>
        {faceExpressions === "happy" && (
          <>
            <img
              className='specific w-[100px] h-[100px] opacity-0 absolute top-0 left-0' // Sun at top left
              src='/images/sun.png'
              alt='Sun'
            />
            <img
              className='specific object-contain w-[50px] h-[auto] opacity-0 absolute top-0 right-0' // Boodaflais at top right
              src='/images/boodaflais.png'
              alt='Boodaflais'
            />
          </>
        )}

        {faceExpressions === "sad" && (
          <>
            <img
              className='specific w-[100px] h-[100px] opacity-0 absolute top-0 left-0'
              src='/images/rain.png'
              alt='Rain'
            />
            <img
              className='specific object-contain w-[50px] h-[auto] opacity-0 absolute top-0 right-0' // Boodaflais at top right
              src='/images/sadflower.png'
              alt='sadflower'
            />
          </>
        )}

        {faceExpressions === "angry" && (
          <>
            <img
              className='specific w-[100px] h-[100px] opacity-0 absolute top-0 left-0'
              src='/images/angry.png'
              alt='Rain'
            />
            <img
              className='specific object-contain w-[50px] h-[auto] opacity-0 absolute top-0 right-0' // Boodaflais at top right
              src='/images/lightningbolt.png'
              alt='sadflower'
            />
          </>
        )}

        {faceExpressions === "neutral" && (
          <img className='specific w-[100px] h-[100px] opacity-0' alt='' />
        )}
      </div>

      <video
        ref={videoRef}
        className='object-cover w-full h-full inverted-video'
        autoPlay
        muted
        onPlay={handleVideoOnPlay}
      />
      <canvas ref={canvasRef} className='hidden' />
      <div className='absolute top-0 left-0 p-4 text-white bg-black bg-opacity-50'>
        <h1>Expression: {faceExpressions}</h1>
      </div>
      {countdown !== null && (
        <div className='absolute p-4 text-white transform -translate-x-1/2 -translate-y-1/2 text-9xl top-1/2 left-1/2'>
          {countdown}
        </div>
      )}
      <div className='absolute bottom-0 left-0 flex p-4'>
        <button
          id='scrnsht_btn'
          className='rounded p-3 text-white bg-blue-500 hover:scale-[1.1] transform transition duration-150'
          onClick={openCapturePhotoButtons}
        >
          <FaCamera />
        </button>

        {showCapturePhotoButtons && (
          <>
            <button
              id='scrnsht_btn'
              className='p-1 ml-2 text-blue-500 bg-[rgb(255,255,255,0.8)] border-2 border-blue-500 rounded'
              onClick={startCountdown}
            >
              Capture photo (Send to AI)
            </button>
            <button
              className='p-1 ml-2 text-blue-500 bg-[rgb(255,255,255,0.8)] border-2 border-blue-500 rounded'
              onClick={startCountdownMood}
            >
              Capture photo (Mood-based art)
            </button>
          </>
        )}
      </div>

      {showPreview && imageData && (
        <ImageModal
          title='Would you like to download this image?'
          confirmText='Yes'
          declineText='No'
          imgSrc={imageData}
          openModule={showPreview}
          cancelMoodScreenshot={handleCancelScreenshot}
          confirmMoodScreenshot={handleConfirmScreenshot}
        />
      )}

      {showMoodPreview && moodImageData && (
        <>
          <ImageModal
            // title='Would you like to download this mood-based art?'
            confirmText='Yes'
            declineText='No'
            imgSrc={moodImageData}
            openModule={showMoodPreview}
            cancelMoodScreenshot={handleCancelMoodScreenshot}
            confirmMoodScreenshot={handleConfirmMoodScreenshot}
          />
        </>
      )}
      {expressionNotDetected && (
        <>
          <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='p-4 bg-white rounded'>
              <h2 className='text-2xl text-red-500'>Error capturing image</h2>
              <p>
                Your facial expression could not be detected. <br />
                Please try again.
              </p>
              <div className='mt-10'>
                <button
                  className='px-4 py-2 text-white bg-blue-500 rounded'
                  onClick={startCountdownMood}
                >
                  Try again
                </button>
                <button
                  className='px-4 py-2 ml-2 text-gray-500'
                  onClick={() => setExpressionNotDetected(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FaceDetection;
