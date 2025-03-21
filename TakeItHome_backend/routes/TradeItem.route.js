
const express = require("express");
<<<<<<< HEAD
const router = express.Router();
const multer = require("multer");
const { getTradeItems, createTradeItems } = require("../controllers/tradeItem.controller.js");

// Multer Configuration for Image Uploads
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// Routes
router.get("/", getTradeItems);
router.post("/", upload.single("image"), createTradeItems); // 📌 Handles image uploads
=======
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
>>>>>>> b62f5b68908076c31bddb6695cab3d4ae1a97612

module.exports = router;
