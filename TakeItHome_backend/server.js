<<<<<<< HEAD
=======
// ✅ Load environment variables
>>>>>>> 6e68454eb27d5e844f19855eb584bbe2e606f44b
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express(); // ✅ KEEPING THIS
const PORT = process.env.PORT || 3000;

const server = http.createServer(app); // create a server from app (this enables socket.io)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

<<<<<<< HEAD
// ✅ Import Routes
const authRoutes = require("./routes/auth.route.js");
const tradeItemRoutes = require("./routes/TradeItem.route.js");
const donationItemRoutes = require("./routes/DonationItem.route.js");
const searchRoutes = require("./routes/search.route.js");
const chatRoutes = require("./routes/chat.route.js");
const itemRequestRoutes = require("./routes/ItemRequest.route.js");

const Message = require("./models/Message.model");

// ✅ MongoDB Debug
=======
const app = express(); // ✅ Must come BEFORE app.use()

const PORT = process.env.PORT || 3000;

// ✅ Debug Mongo URI
>>>>>>> 6e68454eb27d5e844f19855eb584bbe2e606f44b
console.log("DEBUG: MONGO_URI =", process.env.MONGO_URI);
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in .env file.");
  process.exit(1);
}

// ✅ CORS middleware — fix origin here
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

// ✅ JSON & static middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

<<<<<<< HEAD
// ✅ Connect to MongoDB
=======
// ✅ MongoDB connect
>>>>>>> 6e68454eb27d5e844f19855eb584bbe2e606f44b
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// ✅ Import Routes
const authRoutes = require("./routes/auth.route.js");
const tradeItemRoutes = require("./routes/TradeItem.route.js");
const donationItemRoutes = require("./routes/DonationItem.route.js");
const searchRoutes = require("./routes/search.route.js");

// ✅ Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/trade-items", tradeItemRoutes);
<<<<<<< HEAD
app.use("/api/donation-items", donationItemRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/chat", chatRoutes); 
app.use("/api/requests", itemRequestRoutes);

// ✅ Root Route
=======
app.use("/api/donation-items", donationItemRoutes); // called twice in original — fixed
app.use("/api/search", searchRoutes);

// ✅ Default route
>>>>>>> 6e68454eb27d5e844f19855eb584bbe2e606f44b
app.get("/", (req, res) => {
  res.send("🎉 TakeItHome API is running...");
});

<<<<<<< HEAD
// ✅ Socket.IO
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("send_message", async (data) => {
    console.log("📨 Message received:", data);

    try {
      const newMessage = new Message(data);
      await newMessage.save();
    } catch (err) {
      console.error("❌ Message save error:", err.message);
    }

    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ✅ Start server with Socket.IO support
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// ✅ Global error handling
=======
// ✅ Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Handle promise rejections
>>>>>>> 6e68454eb27d5e844f19855eb584bbe2e606f44b
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});
