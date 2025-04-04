const express = require("express");
const router = express.Router();

const multer = require("multer");
const { verifyToken } = require("../middleware/authmiddleware");
const {
  getTradeItems,
  createTradeItem,
  updateTradeItem,
  deleteTradeItem,
  searchTradeItems,
  getTradeItemById,
  reportTradeItem,  // Import the report function
} = require("../controllers/tradeItem.controller");

// ✅ Multer Setup
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
router.get("/all", getTradeItems);
router.get("/search", searchTradeItems);
router.get("/:id", getTradeItemById);

router.post(
  "/post",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createTradeItem
);

router.put(
  "/update/:id",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  updateTradeItem
);

router.delete("/delete/:id", verifyToken, deleteTradeItem);

// ✅ New route for reporting a trade item
router.post("/report/:id", verifyToken, reportTradeItem);  // Add this line for reporting functionality

module.exports = router;
