const express = require("express");
const multer = require("multer");
const { createTradeItem, getTradeItems } = require("../controllers/tradeItem.controller");
const { authenticate } = require("../middleware/authmiddleware");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// Routes
router.get("/all", getTradeItems);
router.post("/post", authenticate, upload.single("image"), createTradeItem); // ✅ THIS LINE

module.exports = router;
