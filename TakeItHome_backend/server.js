const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 3002;

// ✅ Frontend URL: dev vs prod
const frontendUrl = process.env.NODE_ENV === 'production'
  ? 'https://take-it-home-1.onrender.com'
  : 'http://localhost:5173';

// ✅ Setup Socket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: frontendUrl,
    methods: ["GET", "POST"]
  }
});

// ✅ Middleware for parsing and CORS
app.use(cors({
  origin: frontendUrl,
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serving image/video uploads
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));
console.log("✅ Serving static files from:", uploadsPath);

// ✅ Connect MongoDB
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI not defined in .env");
  process.exit(1);
}
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// ✅ Import & use routes
app.use("/api/auth", require("./routes/auth.route.js"));
app.use("/api/trade-items", require("./routes/TradeItem.route.js"));
app.use("/api/donation-items", require("./routes/DonationItem.route.js"));
app.use("/api/search", require("./routes/search.route.js"));
app.use("/api/chat", require("./routes/chat.route.js"));
app.use("/api/requests", require("./routes/ItemRequest.route.js"));
app.use("/api/users", require("./routes/user.route.js"));
app.use("/api/reports", require("./routes/report.route.js"));
app.use("/api/items", require("./routes/Explore.route.js")); // 🌟 Used in Explore.jsx

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🎉 TakeItHome API is running...");
});

// ✅ Socket.io messaging logic
io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);
  socket.on("send_message", async (data) => {
    try {
      const savedMessage = await createMessage(data); // must exist
      io.emit("receive_message", savedMessage);
    } catch (err) {
      console.error("Message save error:", err.message);
    }
  });
});

// ✅ Start the backend server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ✅ Handle unhandled errors
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

// ✅ Debug log for every request
app.use((req, res, next) => {
  console.log(`👉 [${req.method}] ${req.url}`);
  next();
});
