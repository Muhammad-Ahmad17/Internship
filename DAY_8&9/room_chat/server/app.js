const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Middleware for CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("join-room", ({ room, username }) => {
    socket.join(room);
    socket.username = username;
    socket.room = room;

    // console.log(`${username} joined room ${room}`);
    
    // Notify others in the room
    socket.to(room).emit("receive-message", {
      user: "System",
      text: `${username} joined the room.`,
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on("send-message", ({ room, message, username }) => {
    io.to(room).emit("receive-message", {
      user: username,
      text: message,
      time: new Date().toLocaleTimeString(),
    });
  })


socket.on("leave-room", () => {
  const { username, room } = socket;

  if (room && username) {
    socket.to(room).emit("receive-message", {
      user: "System",
      text: `${username} left the room.`,
      time: new Date().toLocaleTimeString(),
    });

    socket.leave(room);
    socket.room = null;
    socket.username = null;
  }
});


});

server.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
