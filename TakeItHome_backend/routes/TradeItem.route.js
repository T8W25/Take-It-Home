const express = require("express");
const multer = require("multer");
const { getTradeItems, createTradeItem, searchTradeItems} = require("../controllers/tradeItem.controller");
const { authenticate } = require("../middleware/authMiddleware");
const { getTradeItemById } = require("../controllers/tradeItem.controller");

const router = express.Router();

// **Multer Storage Configuration (Allowing Images & Videos)**
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/all", getTradeItems);
router.post(
  "/post",
  authenticate,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]), // Support both image & video
  createTradeItem
);

router.get("/search", searchTradeItems); // Now properly initialized
router.get("/:id", getTradeItemById); 


module.exports = router;