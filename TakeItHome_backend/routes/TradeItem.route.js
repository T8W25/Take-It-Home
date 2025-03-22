// ✅ Clean & Final TradeItem.route.js
const express = require("express");
const multer = require("multer");
const {
  getTradeItems,
  createTradeItem,
  searchTradeItems,
  getTradeItemById
} = require("../controllers/tradeItem.controller");

const { verifyToken } = require("../middleware/authmiddleware");

const router = express.Router();

// ✅ Multer setup (uploads image & video to /uploads folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Routes

// Get all trade items
router.get("/all", getTradeItems);

// Search trade items (GET with query)
router.get("/search", searchTradeItems);

// Get item by ID
router.get("/:id", getTradeItemById);

// Post new trade item (with token + upload)
router.post(
  "/post",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createTradeItem
);

module.exports = router;
