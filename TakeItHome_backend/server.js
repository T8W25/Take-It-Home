// ✅ Load environment variables
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express(); // ✅ Must come BEFORE app.use()

const PORT = process.env.PORT || 3000;

// ✅ Debug Mongo URI
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

// ✅ MongoDB connect
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
app.use("/api/donation-items", donationItemRoutes); // called twice in original — fixed
app.use("/api/search", searchRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🎉 TakeItHome API is running...");
});

// ✅ Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Handle promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err.message);
  server.close(() => process.exit(1));
});
