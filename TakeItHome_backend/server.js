const path = require("path"); // Import path first
require("dotenv").config({ path: path.resolve(__dirname, ".env") }); // Now use path

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.route.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Debugging: Print MONGO_URI to check if it's loaded
console.log("DEBUG: MONGO_URI =", process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.error("ERROR: MONGO_URI is not defined in .env");
  process.exit(1);
}

// CORS Middleware (Allow frontend requests)
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Load Routes
app.use("/api/auth", authRoutes);

// Default API Route
app.get("/", (req, res) => {
  res.send("TakeItHome API is running...");
});

// Start Server
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err.message);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("SIGTERM Received. Closing server...");
  server.close(() => console.log("Server Closed."));
});
