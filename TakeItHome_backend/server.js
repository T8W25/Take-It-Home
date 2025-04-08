// const path = require("path");
// require("dotenv").config({ path: path.resolve(__dirname, ".env") });

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io");
// const { createMessage } = require("./controllers/chat.controller");
// const app = express();
// const PORT = process.env.PORT || 3002;

// // ✅ Frontend URL: dev vs prod
// const frontendUrl = process.env.NODE_ENV === 'production'
//   ? 'https://take-it-home-1.onrender.com'
//   : 'http://localhost:5173';

// // ✅ Setup Socket server
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: frontendUrl,
//     methods: ["GET", "POST"]
//   }
// });

// // ✅ Middleware for parsing and CORS
// app.use(cors({
//   origin: frontendUrl,
//   credentials: true,
//   methods: "GET,POST,PUT,DELETE",
//   allowedHeaders: "Content-Type,Authorization"
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ Serving image/video uploads
// const uploadsPath = path.join(__dirname, "uploads");
// app.use("/uploads", express.static(uploadsPath));
// console.log("✅ Serving static files from:", uploadsPath);

// // ✅ Connect MongoDB
// if (!process.env.MONGO_URI) {
//   console.error("❌ ERROR: MONGO_URI not defined in .env");
//   process.exit(1);
// }
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => {
//     console.error("❌ MongoDB Connection Error:", err.message);
//     process.exit(1);
//   });

// // ✅ Import & use routes
// app.use("/api/auth", require("./routes/auth.route.js"));
// app.use("/api/trade-items", require("./routes/TradeItem.route.js"));
// app.use("/api/donation-items", require("./routes/DonationItem.route.js"));
// app.use("/api/search", require("./routes/search.route.js"));
// app.use("/api/chat", require("./routes/chat.route.js"));
// app.use("/api/requests", require("./routes/ItemRequest.route.js"));
// app.use("/api/users", require("./routes/user.route.js"));
// app.use("/api/reports", require("./routes/reportTrade.routes.js"));  // ✅ Corrected route for reports
// app.use("/api/items", require("./routes/Explore.route.js")); // 🌟 Used in Explore.jsx

// // ✅ Root route
// app.get("/", (req, res) => {
//   res.send("🎉 TakeItHome API is running...");
// });

// // ✅ Socket.io messaging logic
// // io.on("connection", (socket) => {
// //   console.log("🔌 Connected:", socket.id);
// //   socket.on("send_message", async (data) => {
// //     try {
// //       const savedMessage = await createMessage(data); // must exist
// //       io.emit("receive_message", savedMessage);
// //     } catch (err) {
// //       console.error("Message save error:", err.message);
// //     }
// //   });
// // });

// io.on("connection", (socket) => {
//   console.log("🔌 Connected:", socket.id);

//   // Join the user to a room named by their userId
//   socket.on("join", (userId) => {
//     socket.join(userId);
//     console.log(`User ${userId} joined their room`);
//   });

//   // When a message is sent
//   socket.on("send_message", async (data) => {
//     try {
//       // Save to DB
//       const saved = await createMessage(data);

//       // Emit to both participants
//       io.to(data.receiverId).emit("receive_message", saved);
//       io.to(data.senderId).emit("receive_message", saved);
//     } catch (err) {
//       console.error("Message save error:", err.message);
//     }
//   });
// });

// // ✅ Start the backend server
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

// // ✅ Handle unhandled errors
// process.on("unhandledRejection", (err) => {
//   console.error("❌ Unhandled Rejection:", err.message);
//   server.close(() => process.exit(1));
// });

// // ✅ Debug log for every request
// app.use((req, res, next) => {
//   console.log(`👉 [${req.method}] ${req.url}`);
//   next();
// });

/*
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { createMessage } = require("./controllers/chat.controller");
const app = express();
const PORT = process.env.PORT || 3002;

// Frontend URL configuration
const frontendUrl = process.env.NODE_ENV === 'production'
  ? 'https://take-it-home-1.onrender.com'
  : 'http://localhost:5173';

// Socket.IO server setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: frontendUrl,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware setup
app.use(cors({
  origin: frontendUrl,
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));
console.log("✅ Serving static files from:", uploadsPath);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Routes configuration
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/trade-items", require("./routes/TradeItem.route"));
app.use("/api/donation-items", require("./routes/DonationItem.route"));
app.use("/api/search", require("./routes/search.route"));
app.use("/api/chat", require("./routes/chat.route"));
app.use("/api/requests", require("./routes/ItemRequest.route"));
app.use("/api/users", require("./routes/user.route"));
app.use("/api/reports", require("./routes/report.route"));
app.use("/api/items", require("./routes/Explore.route"));

// Root route
app.get("/", (req, res) => {
  res.send("🎉 TakeItHome API is running...");
});

// Socket.IO event handlers
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // Join user-specific room
  socket.on("join", (userId) => {
    socket.join(userId.toString());
    console.log(`👤 User ${userId} joined their room`);
  });

  // Handle message sending
  socket.on("send_message", async (data) => {
    try {
      const savedMessage = await createMessage(data);

      // Emit to both participants using string IDs
      io.to(savedMessage.senderId.toString()).emit("receive_message", savedMessage);
      io.to(savedMessage.receiverId.toString()).emit("receive_message", savedMessage);
    } catch (err) {
      console.error("❌ Message save error:", err.message);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("🔌 User disconnected:", socket.id);
  });
});

// Error handling
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

// Request logging
app.use((req, res, next) => {
  console.log(`👉 [${req.method}] ${req.url}`);
  next();
});

*/

//Updated code, if error revert

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

// ✅ Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173", // Frontend development server
  "https://take-it-home-1.onrender.com", // Production frontend
  "https://take-it-home-8ldm.onrender.com", // Backend deployed URL
];

// ✅ CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Incoming Origin:", origin); // Debug log
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin); // Dynamically set the allowed origin
      } else {
        console.error("Blocked by CORS:", origin); // Debug log
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies or authentication headers
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// ✅ Handle Preflight Requests
app.options("*", (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin); // Dynamically set the allowed origin
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.sendStatus(204); // No Content
});

app.use((req, res, next) => {
  console.log("Incoming Request Origin:", req.headers.origin);
  next();
});

// ✅ Middleware for parsing JSON and URL-encoded data
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

  // Existing message handling logic
  socket.on("send_message", async (data) => {
    try {
      const savedMessage = await createMessage(data); // must exist
      io.emit("receive_message", savedMessage);
    } catch (err) {
      console.error("Message save error:", err.message);
    }
  });

  // 🌟 New: Handle trade request notifications
  socket.on("send_trade_request", (data) => {
    const { recipientId, tradeDetails } = data;
    console.log(`📩 Trade request sent to user: ${recipientId}`);
    io.to(recipientId).emit("receive_trade_request", tradeDetails);
  });

  // 🌟 New: Handle donation offer notifications
  socket.on("send_donation_offer", (data) => {
    const { recipientId, donationDetails } = data;
    console.log(`📩 Donation offer sent to user: ${recipientId}`);
    io.to(recipientId).emit("receive_donation_offer", donationDetails);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("🔌 Disconnected:", socket.id);
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

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
