
const express = require("express");
const router = express.Router();

// ── MULTER SETUP ────────────────────────────────────────────────────────────────
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
// ────────────────────────────────────────────────────────────────────────────────

const { verifyToken } = require("../middleware/authmiddleware");
const {
  getTradeItems,
  createTradeItem,
  updateTradeItem,
  deleteTradeItem,
  searchTradeItems,
  getTradeItemById,
  getTradeItemsByUser
} = require("../controllers/tradeItem.controller");

// ✅ Get all trade items
router.get("/all", getTradeItems);

// ✅ Get only this user’s trade items
router.get("/user", verifyToken, getTradeItemsByUser);

// ✅ Search trade items
router.get("/search", searchTradeItems);

// ✅ Get a single trade item by ID
router.get("/:id", getTradeItemById);

// ✅ Create a new trade item (image + optional video)
router.post(
  "/post",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  createTradeItem
);

// ✅ Update a trade item
router.put(
  "/update/:id",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  updateTradeItem
);

// ✅ Delete a trade item
router.delete("/delete/:id", verifyToken, deleteTradeItem);

// Updated route to mark as sold
router.put("/mark-sold/:id", verifyToken, async (req, res) => {
  try {
    const TradeItem = require("../models/tradeItem.model");
    const itemId = req.params.id;
    const userId = req.user.id;
    if (!itemId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }
    const item = await TradeItem.findOne({ _id: itemId, userId });
    if (!item) {
      return res.status(404).json({ message: "Trade item not found or you are not authorized" });
    }
    item.sold = true;
    const savedItem = await item.save();
    // Verify database state
    const verifiedItem = await TradeItem.findById(itemId);
    console.log("Trade item saved:", savedItem);
    console.log("Trade item verified in DB:", verifiedItem);
    if (!verifiedItem.sold) {
      throw new Error("Failed to persist sold status in database");
    }
    res.json({ message: "Trade item marked as sold", item: savedItem });
  } catch (err) {
    console.error("Mark sold error (Trade):", err);
    res.status(500).json({ message: `Failed to mark trade item as sold: ${err.message}` });
  }
});

router.get("/all", async (req, res) => {
  try {
    const TradeItem = require("../models/tradeItem.model");
    const items = await TradeItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
