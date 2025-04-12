const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { createMessage } = require("./controllers/chat.controller"); // ✅ Message saving function

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173" || "https://take-it-home-1.onrender.com/", // ✅ Match frontend
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:5173" || "https://take-it-home-1.onrender.com/",
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static files for profile/image/video
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));
console.log("✅ Serving static files from:", uploadsPath);

// ✅ MongoDB Connect
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found");
  process.exit(1);
}
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// ✅ Routes
app.use("/api/auth", require("./routes/auth.route.js"));
app.use("/api/trade-items", require("./routes/TradeItem.route.js"));
app.use("/api/donation-items", require("./routes/DonationItem.route.js"));
app.use("/api/search", require("./routes/search.route.js"));
app.use("/api/chat", require("./routes/chat.route.js"));
app.use("/api/requests", require("./routes/ItemRequest.route.js"));
app.use("/api/users", require("./routes/user.route.js"));
app.use("/api/reports", require("./routes/report.route.js"));
app.use("/api/items", require("./routes/Explore.route.js"));

app.get("/", (_, res) => {
  res.send("🎉 TakeItHome API is running...");
});

// ✅ SOCKET.IO Realtime Chat Setup
io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("send_message", async (data) => {
    try {
      const savedMessage = await createMessage(data); // ✅ Save to DB
      io.to(data.receiverId).emit("receive_message", savedMessage); // ✅ Send to receiver
      socket.emit("receive_message", savedMessage); // ✅ Also send to sender
    } catch (err) {
      console.error("❌ Message save error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔌 Disconnected:", socket.id);
  });
});

// ✅ Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ✅ Unhandled Rejection Safety
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

// ✅ Debug log for all routes
app.use((req, res, next) => {
  console.log(`👉 [${req.method}] ${req.url}`);
  next();
});
