// ✅ Final: TradeItem.route.js
const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authmiddleware");
const upload = require("../middleware/multer.middleware");

const {
  getTradeItems,
  createTradeItem,
  updateTradeItem,
  deleteTradeItem,
  searchTradeItems,
  getTradeItemById,
} = require("../controllers/tradeItem.controller");

// ✅ Routes

// Get all trade items
router.get("/all", getTradeItems);

// Create a new trade item with image/video
router.post(
  "/post",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createTradeItem
);

// Update trade item
router.put("/edit/:id", verifyToken, updateTradeItem);

// Delete trade item
router.delete("/delete/:id", verifyToken, deleteTradeItem);

// Search trade items or get by query
router.get("/search", searchTradeItems);
router.get("/:id", getTradeItemById);

module.exports = router;
