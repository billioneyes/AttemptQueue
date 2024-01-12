const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Example: Handle chat messages
  socket.on('chatMessage', (message) => {
    console.log('Received chat message:', message);
    // Broadcast the message to all clients
    io.emit('chatMessage', message);
  });

  // Example: Handle video queue updates
  socket.on('videoQueued', (video) => {
    console.log('Received video update:', video);
    // Broadcast the video information to all clients
    io.emit('videoQueued', video);
  });

  // Clean up on socket disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Multer for handling file uploads
const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Example: Handle video uploads
app.post('/upload', upload.single('video'), (req, res) => {
  try {
    // Handle the video upload here (save to a database, process, etc.)
    const video = {
      filename: req.file.originalname,
      // Add more video details as needed
    };

    // Example: Notify clients about the new video
    io.emit('videoQueued', video);

    res.json({ message: 'Video uploaded successfully!' });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
