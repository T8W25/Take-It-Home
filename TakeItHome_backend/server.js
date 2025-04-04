const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express(); // ✅ Moved before usage
const PORT = process.env.PORT || 3000;

// ✅ Determine the front-end URL based on the environment
const frontendUrl = process.env.NODE_ENV === 'production' ? 'https://take-it-home-1.onrender.com' : 'http://localhost:5173';

// ✅ Create server & socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: frontendUrl,  // ✅ Dynamically set based on environment
    methods: ["GET", "POST"]
  }
});

// ✅ Import Routes
const authRoutes = require("./routes/auth.route.js");
const tradeItemRoutes = require("./routes/TradeItem.route.js");
const donationItemRoutes = require("./routes/DonationItem.route.js");
const searchRoutes = require("./routes/search.route.js");
const chatRoutes = require("./routes/chat.route.js");
const itemRequestRoutes = require("./routes/ItemRequest.route.js");
const userRoutes = require("./routes/user.route.js"); // ✅ only once
const reportRoutes = require("./routes/report.route.js"); 
const exploreRoutes = require('./routes/Explore.route')// ✅ Added report routes

const Message = require("./models/Message.model");

console.log("DEBUG: MONGO_URI =", process.env.MONGO_URI);
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in .env file.");
  process.exit(1);
}

// ✅ Middlewares
app.use(cors({
  origin: frontendUrl,  // ✅ Dynamically set based on environment
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded form data
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// ✅ Mount Routes
app.use("/api/auth", authRoutes); // ✅ Includes password recovery routes
app.use("/api/trade-items", tradeItemRoutes);
app.use("/api/donation-items", donationItemRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/requests", itemRequestRoutes);
app.use("/api/users", userRoutes); // ✅ FIXED
app.use("/api/reports", reportRoutes); 
app.use('/api/items', exploreRoutes);// ✅ Mounted the report routes

app.get("/", (req, res) => {
  res.send("🎉 TakeItHome API is running...");
});

// ✅ Socket.IO Events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", async (data) => {
    try {
      const savedMessage = await createMessage(data); // Use the controller function
      io.emit("receive_message", savedMessage); // Emit the populated message
    } catch (err) {
      console.error("Message save error:", err.message);
    }
  });

  // Optionally, you can handle other socket events related to reports or trade messaging
});

// ✅ Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// ✅ Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

// Debug middleware execution
app.use((req, res, next) => {
  console.log("Middleware executed. Request Body:", req.body);
  next();
});
