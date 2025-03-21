
const express = require("express");
const { createTradeItem, getTradeItems } = require("../controllers/tradeItem.controller");
const { authenticate } = require("../middleware/authMiddleware");
const multer = require("multer");

const router = express.Router();

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

// POST a new trade item (Only logged-in users)
router.post("/post", authenticate, upload.single("image"), createTradeItem);

// GET all trade items (Publicly accessible)
router.get("/all", getTradeItems);

module.exports = router;
