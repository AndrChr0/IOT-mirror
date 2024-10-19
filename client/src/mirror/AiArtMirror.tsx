import { useEffect, useRef, useState } from "react";
import "./FaceDetection.css";
import { FaCamera } from "react-icons/fa";
import ImageModal from "@/ImageModal";
import AiImagePreview from "./AiImagePreview";
import Processing from "./Processing";

export default function AiArtMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [blitz, setBlitz] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showCapturePhotoButtons, setShowCapturePhotoButtons] = useState(false);
  const [recievedImg, setRecievedImg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  console.log("recievedImg", recievedImg);

  useEffect(() => {
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

    startVideo();
  }, []);

  useEffect(() => {
    const SpeechRecognition = (window.SpeechRecognition ||
      window.webkitSpeechRecognition) as typeof window.SpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[event.resultIndex][0].transcript
          .trim()
          .toLowerCase();
        console.log("Voice input: ", transcript);

        if (transcript.includes("open blue camera")) {
          setShowCapturePhotoButtons(true);
        } else if (transcript.includes("close blue camera")) {
          setShowCapturePhotoButtons(false);
        }

        if (
          showCapturePhotoButtons === true &&
          transcript.includes("capture photo")
        ) {
          startCountdown();
          console.log("Capturing photo");
        }

        if (showPreview && imageData) {
          if (transcript.includes("yes")) {
            handleConfirmScreenshot();
            console.log("downloading");
          } else if (transcript.includes("no")) {
            handleCancelScreenshot();
            console.log("cancelling");
          }
        }
      };

      recognition.start();
    } else {
      console.error("Speech Recognition not supported in this browser.");
    }
  }, [showCapturePhotoButtons, showPreview, imageData]);

  const handleVideoOnPlay = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
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

  const triggerBlitzEffect = () => {
    setBlitz(true);
    setTimeout(() => setBlitz(false), 500);
  };

  // SKAL BRUKES TIL Å SENDE IMG TIL BACKEND
  const handleConfirmScreenshot = async () => {
    setIsProcessing(true);
    setShowPreview(false);

    if (imageData) {
      try {
        const response = await fetch("http://localhost:5353/upload-base64", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageData }),
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log("Image uploaded successfully");
          console.log("Response data:", responseData);

          // Extract the AI image URL from the response
          const { aiImg } = responseData;
          setRecievedImg(aiImg); // Set the received AI image
          setIsProcessing(false);
        } else {
          console.error("Error uploading image");
          const errorData = await response.json();
          console.error("Error details:", errorData);
          setIsProcessing(false);
        }
      } catch (error) {
        console.error("Error uploading image", error);
        setIsProcessing(false);
      }
    } else {
      console.error("No image data to send");
      setIsProcessing(false);
    }

    setImageData(null);
  };

  const handleCancelScreenshot = () => {
    setShowPreview(false);
    setImageData(null);
  };

  const openCapturePhotoButtons = () => {
    setShowCapturePhotoButtons((prev) => !prev);
  };

  const handleRecievedImg = (img: string | null) => {
    setRecievedImg(img);
  };

  return (
    <div className={`relative h-screen ${blitz ? "blitz-effect" : ""}`}>
      <div className='absolute z-10 w-full mt-20'></div>

      <video
        ref={videoRef}
        className='object-cover w-full h-full inverted-video'
        autoPlay
        muted
        onPlay={handleVideoOnPlay}
      />
      <canvas ref={canvasRef} className='hidden' />
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
      {recievedImg && (
        <AiImagePreview
          image={recievedImg}
          handleImageData={handleRecievedImg}
        />
      )}
      {isProcessing && <Processing />}
    </div>
  );
}
