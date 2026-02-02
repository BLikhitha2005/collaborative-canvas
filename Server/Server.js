const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", socket => {
  console.log("User connected:", socket.id);

  socket.on("draw", data => {
    socket.broadcast.emit("draw", data);
  });

  socket.on("cursor", data => {
    socket.broadcast.emit("cursor", {
      id: socket.id,
      x: data.x,
      y: data.y
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-left", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
