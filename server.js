const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http"); // Required for Socket.io
const { Server } = require("socket.io"); // Required for Socket.io
require("dotenv").config();

const app = express();
const server = http.createServer(app); // Wrap Express app

// Configure Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "*", // Allows connections from local or deployed frontends
    methods: ["GET", "POST", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());

// Pass "io" instance to our routes using middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/items", require("./routes/itemRoutes"));

// Real-time Connection Listener
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
// CRUCIAL: Change app.listen to server.listen
server.listen(PORT, () =>
  console.log(`Real-time server running on port ${PORT}`),
);
