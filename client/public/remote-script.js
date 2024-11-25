const confirmation = document.querySelector(".confirmation");
const confirmationButtons = document.querySelectorAll(
  ".confirmation-buttons button"
);
const powerOffButton = document.querySelector(".power-off-button");

const socket = io("http://10.22.218.178:3000");

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
