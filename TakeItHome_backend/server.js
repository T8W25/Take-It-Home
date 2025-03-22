const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.route.js");
const tradeItemRoutes = require("./routes/TradeItem.route.js");
const donationItemRoutes = require("./routes/DonationItem.route.js"); // ✅ Added route

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Debug Mongo URI
console.log("DEBUG: MONGO_URI =", process.env.MONGO_URI);
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in .env file.");
  process.exit(1);
}

// ✅ CORS Configuration
app.use(
  cors({
    origin: "*", // Adjust in production
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// ✅ Built-in Middlewares
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// ✅ Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/trade-items", tradeItemRoutes);
app.use("/api/donation-items", donationItemRoutes); // ✅ Important!

// ✅ Root Endpoint
app.get("/", (req, res) => {
  res.send("🎉 TakeItHome API is running...");
});

// ✅ Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Handle Crashes
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err.message);
  server.close(() => process.exit(1));
});
