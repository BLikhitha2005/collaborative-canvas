const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const rooms = require("./rooms");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", socket => {
  const room = rooms.default;

  socket.emit("history", room.getAll());

  socket.on("draw", stroke => {
    stroke.userId = socket.id;
    room.addStroke(stroke);
    io.emit("draw", stroke);
  });

  socket.on("undo", () => {
    room.undo(socket.id);
    io.emit("history", room.getAll());
  });

  socket.on("cursor", pos => {
    socket.broadcast.emit("cursor", { id: socket.id, pos });
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
