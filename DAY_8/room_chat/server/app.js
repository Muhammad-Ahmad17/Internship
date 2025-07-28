import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 3000;

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// WebSocket connection handler
io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.on("message", ({ room, message }) => {
  console.log({ room, message });
    socket.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room); 
    console.log(`User joined room ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/*
  Summary:
  - io: Represents the global Socket.IO server instance; used to broadcast or access all connections.
  - socket: Represents an individual user's connection; used to communicate with or listen for that user's events.
*/

/*
socket.emit('event')              // Only to this client
io.emit('event')                  // To all clients
socket.broadcast.emit('event')    // To all EXCEPT this client

socket.to('room').emit('event')   // To room, EXCLUDING this client
io.to('room').emit('event')       // To room, INCLUDING this client
*/