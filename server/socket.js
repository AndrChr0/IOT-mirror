import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'; 
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://10.110.50.145:5500', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
});

// Serve static files from the public folder in the client directory
app.use(express.static(path.join(__dirname, '../client/public')));

app.get('/test', (req, res) => {
  res.send('Server is running!');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/socket.html'));
});

app.get('/remote', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/remote.html'));
});

app.get('/remote-swipe', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/remote-swipe.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('style-selected', (style) => {
    console.log(`Style selected: ${style}`);
    io.emit('style-changed', style); 
  });

  socket.on('toggle-camera', () => {
    console.log('Camera toggled');
    io.emit('toggle-camera');
  });

  socket.on('handle-go-back', () => {
    console.log('Go back');
    io.emit('handle-go-back');
  });

  socket.on('handle-capture-photo', () => {
    console.log('Capture photo');
    io.emit('handle-capture-photo');
  });


  // swipe events thangs
  socket.on('handle-swipe', (direction) => {
    console.log(`Swipe ${direction}`); 
    io.emit('handle-swipe', direction);
  });

  socket.on('handle-click', () => {
    console.log('Click detected'); 
    io.emit('handle-click');
  });

  socket.on('toggle-recognizing', () => {
    console.log('Toggle recognizing');
    io.emit('toggle-recognizing');
  });

  socket.on('scanned-qr-code', () => {
    console.log('Toggle QR code');
    io.emit('scanned-qr-code');
  });

  socket.on('handle-remote-refresh', () => {
    console.log('Refresh remote');
    io.emit('handle-remote-refresh');
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
