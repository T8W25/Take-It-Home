const express = require("express");
const multer = require("multer");
const { createTradeItems, getTradeItems } = require("../controllers/tradeItem.controller");
const { authenticate } = require("../middleware/authmiddleware");

const router = express.Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
router.get("/all", getTradeItems); // Public route to get all items
router.post("/post", authenticate, upload.single("image"), createTradeItems); // Authenticated users can post items

module.exports = router;
