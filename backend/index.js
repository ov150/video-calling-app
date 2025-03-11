// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store active users
const activeUsers = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user registration
  socket.on('register', (username) => {
    console.log(`User registered: ${username}`);
    activeUsers[socket.id] = { username, socketId: socket.id };
    
    // Broadcast updated user list to all clients
    io.emit('activeUsers', Object.values(activeUsers));
  });

  // Handle call requests
  socket.on('callUser', ({ to, from, signal }) => {
    io.to(to).emit('incomingCall', { from, signal, callerName: activeUsers[from]?.username });
  });

  // Handle call acceptance
  socket.on('answerCall', ({ to, signal }) => {
    io.to(to).emit('callAccepted', { signal, answererName: activeUsers[socket.id]?.username });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    delete activeUsers[socket.id];
    io.emit('activeUsers', Object.values(activeUsers));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});