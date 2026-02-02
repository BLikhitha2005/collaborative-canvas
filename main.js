const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const toolbarHeight = document.getElementById("toolbar").offsetHeight;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - toolbarHeight;
canvas.style.marginTop = toolbarHeight + "px";

// Socket
const socket = io("http://localhost:3000");

// Tool state
let drawing = false;
let lastX = 0;
let lastY = 0;
let currentTool = "brush";
let currentColor = "#000000";
let currentWidth = 3;

// Toolbar
document.getElementById("brushBtn").onclick = () => currentTool = "brush";
document.getElementById("eraserBtn").onclick = () => currentTool = "eraser";
document.getElementById("colorPicker").onchange = e => currentColor = e.target.value;
document.getElementById("strokeWidth").oninput = e => currentWidth = e.target.value;

// Ghost cursors
const remoteCursors = {};

// Mouse events
canvas.addEventListener("mousedown", e => {
  drawing = true;
  const rect = canvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
});

canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseout", () => drawing = false);

canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  socket.emit("cursor", { x, y });

  if (!drawing) return;

  const stroke = {
    x1: lastX,
    y1: lastY,
    x2: x,
    y2: y,
    color: currentColor,
    width: currentWidth,
    tool: currentTool
  };

  drawStroke(stroke);
  socket.emit("draw", stroke);

  lastX = x;
  lastY = y;
});

// Draw stroke
function drawStroke({ x1, y1, x2, y2, color, width, tool }) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.stroke();
  drawCursors();
}

// Draw ghost cursors
function drawCursors() {
  Object.values(remoteCursors).forEach(({ x, y }) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
  });
}

// Socket listeners
socket.on("draw", stroke => drawStroke(stroke));

socket.on("cursor", ({ id, x, y }) => {
  remoteCursors[id] = { x, y };
});

socket.on("user-left", id => {
  delete remoteCursors[id];
});
