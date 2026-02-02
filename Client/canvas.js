import {
  sendStroke,
  onStroke,
  sendCursor,
  onCursor,
  requestUndo,
  onHistory
} from "./websocket.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let prev = null;
let strokes = [];
let cursors = {};

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function drawLine(s, e, color = "black", width = 5) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(s.x, s.y);
  ctx.lineTo(e.x, e.y);
  ctx.stroke();
}

canvas.addEventListener("mousedown", e => {
  drawing = true;
  prev = getPos(e);
});

canvas.addEventListener("mousemove", e => {
  const pos = getPos(e);
  sendCursor(pos);

  if (!drawing) return;

  drawLine(prev, pos);

  const stroke = { start: prev, end: pos };
  sendStroke(stroke);

  prev = pos;
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
  prev = null;
});

onStroke(stroke => {
  strokes.push(stroke);
  drawLine(stroke.start, stroke.end);
});

onHistory(history => {
  strokes = history;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  strokes.forEach(s => drawLine(s.start, s.end));
});

onCursor(data => {
  cursors[data.id] = data.pos;
});

function drawCursors() {
  requestAnimationFrame(drawCursors);
  ctx.save();
  Object.values(cursors).forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

drawCursors();

document.getElementById("undoBtn").onclick = () => {
  requestUndo();
};
