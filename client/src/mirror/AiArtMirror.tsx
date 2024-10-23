import { useEffect, useRef, useState } from "react";
import "./FaceDetection.css";
import { FaCamera } from "react-icons/fa";
import ImageModal from "@/ImageModal";
import AiImagePreview from "./AiImagePreview";
import Processing from "./Processing";
import SelectStyle from "./SelectStyle";
import { Style, styles } from "./styles";
import io from "socket.io-client";
import { IoIosMic } from "react-icons/io";
import { IoIosMicOff } from "react-icons/io";

const socket = io("http://192.168.2.142:3000");

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
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [voiceOptions, setVoiceOptions] = useState(false);
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [skibidi, setSkibidi] = useState(false);
  const focusedElementRef = useRef<HTMLElement | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [wiggleClass, setWiggleClass] = useState("");
  // const [showQrCode, setShowQrCode] = useState(true);

  console.log("recievedImg", recievedImg);

  useEffect(() => {
    socket.on("style-changed", (style) => {
      console.log(`Received style change:`, style);
      setSelectedStyle(style);
    });

    socket.on("toggle-camera", () => {
      setShowCapturePhotoButtons((prev) => !prev);
      const clickSound = new Audio("/assets/click.wav");
      clickSound.play();
    });

    socket.on("handle-go-back", () => {
      handleGoBack();
    });

    socket.on("handle-capture-photo", () => {
      startCountdown();
    });

    socket.on("handle-click", () => {
      console.log("Received button click from phone!");
    });

    socket.on("handle-swipe", (direction) => {
      console.log(`Received swipe ${direction} from phone!`);
    });

    socket.on("handle-click", () => {
      console.log("Simulate click on desktop");
    });

    socket.on("toggle-recognizing", () => {
      setIsRecognizing((prev) => !prev);
      console.log("Recognizing:", isRecognizing);
      const clickSound = new Audio("/assets/click.wav");
      clickSound.play();
    });

    // socket.on("scanned-qr-code", () => {
    //   setShowQrCode(false);
    // });

    // socket.on("handle-remote-refresh", () => {
    //   setShowQrCode(true);
    // });

    return () => {
      socket.off("style-changed");
      socket.off("toggle-camera");
      socket.off("handle-go-back");
      socket.off("handle-click");
      socket.off("handle-swipe");
      socket.off("toggle-recognizing");
      socket.off("toggle-qr-code");
    };
  }, []);

  useEffect(() => {
    const focusFirstElement = () => {
      setTimeout(() => {
        const focusableElements = Array.from(
          document.querySelectorAll("[tabindex]")
        );

        const elementsToFocus = selectedStyle
          ? Array.from(document.querySelectorAll(".selectedTabIndex"))
          : focusableElements;

        if (elementsToFocus.length > 0) {
          const firstElement = elementsToFocus[0] as HTMLElement;
          firstElement.focus();
          focusedElementRef.current = firstElement;
        }
      }, 0); // Delay for the DOM to update
    };
    focusFirstElement();
  }, [selectedStyle, showCapturePhotoButtons]);

  useEffect(() => {
    const handleSwipe = (direction: string) => {
      const focusableElements = Array.from(
        document.querySelectorAll("[tabindex]")
      );
      const selectedTabIndexElements = Array.from(
        document.querySelectorAll(".selectedTabIndex")
      );
      const elementsToSwipe = selectedStyle
        ? selectedTabIndexElements
        : focusableElements;

      if (!focusedElementRef.current) {
        const firstElement = elementsToSwipe[0] as HTMLElement;
        if (firstElement) {
          firstElement.focus();
          focusedElementRef.current = firstElement;
        }
        return;
      }

      const currentIndex = elementsToSwipe.indexOf(focusedElementRef.current);
      console.log(`Current index: ${currentIndex}`);

      if (direction === "left" || direction === "up") {
        const previousIndex =
          (currentIndex - 1 + elementsToSwipe.length) % elementsToSwipe.length;
        const previousElement = elementsToSwipe[previousIndex] as HTMLElement;
        if (previousElement && previousElement !== focusedElementRef.current) {
          previousElement.focus();
          focusedElementRef.current = previousElement; // Update ref
        }
      } else if (direction === "right" || direction === "down") {
        const nextIndex = (currentIndex + 1) % elementsToSwipe.length;
        const nextElement = elementsToSwipe[nextIndex] as HTMLElement;
        if (nextElement && nextElement !== focusedElementRef.current) {
          nextElement.focus();
          focusedElementRef.current = nextElement; // Update ref
        }
      }
    };

    socket.on("handle-click", () => {
      console.log("Received button click from phone!");
      if (focusedElementRef.current) {
        const clickSound = new Audio("/assets/click.wav");
        focusedElementRef.current.click();
        clickSound.play();
      }
    });

    socket.on("handle-swipe", (direction) => {
      console.log(`Received swipe ${direction} from phone!`);
      handleSwipe(direction);
      const menuSound = new Audio("/assets/menu.wav");
      menuSound.play();
    });

    socket.on("handle-direction", (direction) => {
      console.log(`Received direction ${direction} from phone!`);
      handleSwipe(direction);
      const menuSound = new Audio("/assets/menu.wav");
      menuSound.play();
    });

    const handleFocus = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement) {
        focusedElementRef.current = event.target;
      }
    };

    const handleBlur = () => {
      focusedElementRef.current = null;
    };

    document.addEventListener("focusin", handleFocus);
    document.addEventListener("focusout", handleBlur);

    return () => {
      socket.off("handle-click");
      socket.off("handle-swipe");
      socket.off("handle-direction");
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("focusout", handleBlur);
    };
  }, [selectedStyle]);

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
        setTranscription(transcript);

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
          console.log("Capturing photo..");
        }

        if (showPreview && imageData) {
          if (transcript.includes("yes")) {
            handleConfirmScreenshot();
            console.log("Downloading..");
          } else if (transcript.includes("no")) {
            handleCancelScreenshot();
            console.log("Cancelling..");
          }
        }

        if (showCapturePhotoButtons) {
          if (transcript.includes("options")) {
            handleVoiceOptions();
            setStyleDropdownOpen(true);
          }
          const matchedStyle = styles.find((style) =>
            transcript.includes(style.name.toLowerCase())
          );
          if (matchedStyle) {
            handleStyleSelect(matchedStyle);
            setStyleDropdownOpen(false);
            console.log(styleDropdownOpen);
          }

          if (transcript.includes("go back")) {
            handleGoBack();
          }
        }

        if (transcript.includes("skibidi")) {
          setSkibidi(true);
          console.log("state of skib:", skibidi);
        }
      };

      if (isRecognizing) {
        recognition.start();
      } else {
        recognition.stop();
      }

      // Cleanup
      return () => {
        recognition.stop();
      };
    } else {
      console.error("Speech Recognition not supported in this browser.");
    }
  }, [showCapturePhotoButtons, showPreview, imageData, isRecognizing]);

  useEffect(() => {
    console.log("Recognizing:", isRecognizing);
  }, [isRecognizing]);

  useEffect(() => {
    if (transcription) {
      const timer = setTimeout(() => {
        setTranscription(null);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [transcription]);

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
        const shutterSound = new Audio("/assets/shutter.mp3");
        shutterSound.play();
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
    setShowCapturePhotoButtons(false);
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
          body: JSON.stringify({
            imageData,
            selectedStyle: selectedStyle?.style_prompt,
          }),
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
    setShowCapturePhotoButtons(true);
  };

  const openCapturePhotoButtons = () => {
    setShowCapturePhotoButtons((prev) => !prev);
  };

  const handleRecievedImg = (img: string | null) => {
    setRecievedImg(img);
  };

  const handleStyleSelect = (style: Style) => {
    setSelectedStyle(style);
    console.log("here", selectedStyle);
    setStyleDropdownOpen(false);
    console.log("Selected style via voice:", style.name);
  };

  const handleVoiceOptions = () => {
    setVoiceOptions(true);
  };

  const handleGoBack = () => {
    setSelectedStyle(null);
  };

  const elevatorAudio = useRef(new Audio("/assets/elevator.mp3"));
  useEffect(() => {
    if (isProcessing) {
      const playAudio = async () => {
        try {
          await elevatorAudio.current.play();
        } catch (error) {
          console.error("Failed to play audio:", error);
        }
      };

      playAudio();
    } else {
      if (elevatorAudio.current) {
        elevatorAudio.current.pause();
        elevatorAudio.current.currentTime = 0;
      }
    }
  }, [isProcessing]);

  useEffect(() => {
    if (skibidi) {
      const timer = setTimeout(() => {
        setSkibidi(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [skibidi]);

  useEffect(() => {
    setWiggleClass("wiggle");
    const timer = setTimeout(() => setWiggleClass(""), 400);
    return () => clearTimeout(timer);
  }, [isRecognizing]);

  return (
    <div className={`relative h-screen ${blitz ? "blitz-effect" : ""}`}>
      <div className="absolute z-10 w-full mt-20"></div>

      <video
        ref={videoRef}
        className="object-cover w-full h-full inverted-video"
        autoPlay
        muted
        onPlay={handleVideoOnPlay}
      />
      <canvas ref={canvasRef} className="hidden" />
      {countdown !== null && (
        <div className="absolute p-4 text-white transform -translate-x-1/2 -translate-y-1/2 text-9xl top-1/2 left-1/2">
          <span className="countdown">{countdown}</span>
        </div>
      )}

      <div
        id="scrnsht_btn-container"
        className="absolute bottom-0 left-0 flex p-4"
      >
        <button
          id="scrnsht_btn"
          className="rounded p-3 text-white bg-blue-500 hover:scale-[1.1] transform transition duration-150"
          onClick={openCapturePhotoButtons}
        >
          <FaCamera />
        </button>
      </div>
      {showCapturePhotoButtons && (
        <>
          <SelectStyle
            onCapturePhoto={startCountdown}
            onCloseModal={() => setShowCapturePhotoButtons(false)}
            onStyleSelect={handleStyleSelect}
            voiceOptions={voiceOptions}
            onResetVoiceOptions={() => setVoiceOptions(false)}
            selectedStyleDrop={selectedStyle}
            styleDropdownOpen={styleDropdownOpen}
            onGoBack={handleGoBack}
          />
        </>
      )}

      {showPreview && imageData && (
        <>
          <ImageModal
            title={`Do you want to transform this image into "${
              selectedStyle ? selectedStyle.name : ""
            }" style?`}
            confirmText="Yes"
            declineText="Try again"
            imgSrc={imageData}
            openModule={showPreview}
            cancelMoodScreenshot={handleCancelScreenshot}
            confirmMoodScreenshot={handleConfirmScreenshot}
          />
        </>
      )}
      {recievedImg && (
        <AiImagePreview
          artStyle={selectedStyle ? selectedStyle.description : ""}
          image={recievedImg}
          handleImageData={handleRecievedImg}
        />
      )}
      {isProcessing && <Processing />}
      {transcription && (
        <div className="absolute bottom-0 right-0 w-full mb-4 transcription-wrapper">
          <div className="h-auto text-white bg-black bg-opacity-50 transcription-container">
            "{transcription}"
          </div>
        </div>
      )}

      {skibidi && (
        <img
          className="absolute z-[999999] top-0"
          src="https://assets-prd.ignimgs.com/2024/07/25/skibidi-toilet-button-1721912547107.jpg"
          alt=""
        />
      )}
      <div className="absolute top-0 m-2">
        {isRecognizing ? (
          <div className={wiggleClass}>
            <IoIosMic size={30} />
          </div>
        ) : (
          <div className={wiggleClass}>
            <IoIosMicOff size={30} color="red" />
          </div>
        )}
      </div>
      {/* {showQrCode && (
        <div className="absolute top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center qr-code z-[999999999]">
          <img
            // src="/public/images/qr-code-ntnu.png"
            src="/public/images/qr-remote.png"
            // src="/public/images/qr-remote-nt6.png"
            alt="QR code"
            className="w-[220px] h-[220px] qr-code-img"
          />
        </div>
      )} */}
    </div>
  );
}
