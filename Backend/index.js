const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

// Serve a basic HTTP endpoint if needed
app.get('/', (req, res) => {
  res.send({ status: 'Backend is running' });
});

const server = http.createServer(app);

// Initialize Socket.IO with CORS enabled for frontend
const io = new Server(server, {
  cors: {
    origin: "*", // allow any origin during development
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  // Receive audio chunks from the frontend
  socket.on('audio-chunk', (data) => {
    // As per requirements: "sending this audio chunks to sarvam AI... you dont have to do anything related to this right now"
    // So we just receive them and avoid logging every single chunk to prevent console spam.
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT,()=>{
    console.log("Server running on ",PORT)
})
