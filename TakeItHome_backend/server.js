// ✅ server.js (Fixed & Clean)
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.route.js");
const tradeItemRoutes = require("./routes/TradeItem.route.js");

const app = express();
const PORT = process.env.PORT || 3000;

console.log("DEBUG: MONGO_URI =", process.env.MONGO_URI);
if (!process.env.MONGO_URI) {
  console.error("ERROR: MONGO_URI is not defined in .env");
  process.exit(1);
}

// CORS Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => {
  console.error("MongoDB Connection Error:", err.message);
  process.exit(1);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trade-items", tradeItemRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("TakeItHome API is running...");
});

// Server Start
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err.message);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("SIGTERM Received. Closing server...");
  server.close(() => console.log("Server Closed."));
});
