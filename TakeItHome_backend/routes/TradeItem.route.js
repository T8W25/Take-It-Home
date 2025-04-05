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
  getMyTradeItems
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
router.get("/my-posts", verifyToken, getMyTradeItems);

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

module.exports = router;
