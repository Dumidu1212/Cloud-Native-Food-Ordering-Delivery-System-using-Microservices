const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const http = require("http");
const { Server } = require("socket.io");
const deliveryRoutes = require("./src/Routes/deliveryRoutes");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/delivery", deliveryRoutes);

// Socket.IO events
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Make `io` accessible to other modules (optional)
app.set("io", io);

// Connect Database
connectDB();

// Start the server (IMPORTANT: use server.listen, NOT app.listen!)
const PORT = process.env.PORT || 4100;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
