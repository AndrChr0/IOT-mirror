const confirmation = document.querySelector(".confirmation");
const confirmationButtons = document.querySelectorAll(
  ".confirmation-buttons button"
);
const powerOffButton = document.querySelector(".power-off-button");

const socket = io("http://192.168.2.142:3000");

confirmationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.id === "yes") {
      confirmation.style.display = "none";
      socket.emit("scanned-qr-code");
    } else {
      window.location.href = "http://google.com";
    }
  });
});

powerOffButton.addEventListener("click", () => {
  const powerOffConfirmation = document.querySelector(
    ".power-off-confirmation"
  );
  powerOffConfirmation.style.display = "flex";

  const powerOffConfirmationButtons = document.querySelectorAll(
    ".power-off-confirmation-buttons button"
  );
  powerOffConfirmationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.id === "yes") {
        window.location.href = "http://google.com";
      } else {
        powerOffConfirmation.style.display = "none";
      }
    });
  });
});

document.querySelector("#toggle-camera").addEventListener("click", () => {
  console.log("Toggle camera");
  socket.emit("toggle-camera");

  const camera = document.querySelector("#toggle-camera");
  if (camera.classList.contains("border")) {
    camera.classList.remove("border");
  } else {
    camera.classList.add("border");
  }
});

document.querySelector("#toggle-recognizing").addEventListener("click", () => {
  console.log("Toggle recognizing");
  socket.emit("toggle-recognizing");

  const slash = document.querySelector("#slash");
  if (slash.style.display === "none") {
    slash.style.display = "block";
  } else {
    slash.style.display = "none";
  }
});

const handleDirection = (direction) => {
  console.log(`Direction: ${direction}`);
  socket.emit("handle-direction", direction);
};

const handleClick = () => {
  console.log("Click detected");
  socket.emit("handle-click");
};

document
  .querySelector("#button-up")
  .addEventListener("click", () => handleDirection("up"));
document
  .querySelector("#button-down")
  .addEventListener("click", () => handleDirection("down"));
document
  .querySelector("#button-left")
  .addEventListener("click", () => handleDirection("left"));
document
  .querySelector("#button-right")
  .addEventListener("click", () => handleDirection("right"));

const buttonClick = document.querySelector("#button-click");
buttonClick.addEventListener("click", handleClick);
