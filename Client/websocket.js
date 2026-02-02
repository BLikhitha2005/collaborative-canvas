import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";

const socket = io("http://localhost:3000");

export function sendStroke(stroke) {
  socket.emit("draw", stroke);
}

export function onStroke(callback) {
  socket.on("draw", callback);
}

export function sendCursor(pos) {
  socket.emit("cursor", pos);
}

export function onCursor(callback) {
  socket.on("cursor", callback);
}

export function requestUndo() {
  socket.emit("undo");
}

export function onHistory(callback) {
  socket.on("history", callback);
}

