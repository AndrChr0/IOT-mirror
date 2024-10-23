import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Serve static files from the public folder in the client directory
app.use(express.static(path.join(__dirname, "../client/public")));

app.get("/remote-classic", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public/remote-classic.html"));
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("style-selected", (style) => {
    console.log(`Style selected: ${style}`);
    io.emit("style-changed", style);
  });

  socket.on("toggle-camera", () => {
    console.log("Camera toggled");
    io.emit("toggle-camera");
  });

  socket.on("handle-go-back", () => {
    console.log("Go back");
    io.emit("handle-go-back");
  });

  socket.on("handle-capture-photo", () => {
    console.log("Capture photo");
    io.emit("handle-capture-photo");
  });

  socket.on("handle-direction", (direction) => {
    console.log(`Direction ${direction}`);
    io.emit("handle-direction", direction);
  });

  socket.on("handle-click", () => {
    console.log("Click detected");
    io.emit("handle-click");
  });

  socket.on("toggle-recognizing", () => {
    console.log("Toggle recognizing");
    io.emit("toggle-recognizing");
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
