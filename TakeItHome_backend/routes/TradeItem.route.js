const express = require("express");
const router = express.Router();
const multer = require("multer");
const { getTradeItems, createTradeItems } = require("../controllers/tradeItem.controller.js");
const { authenticate } = require("../middleware/authmiddleware"); // Ensure authentication is correctly applied

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
router.post("/", authenticate, upload.single("image"), createTradeItems); // Ensures only authenticated users can post trade items

module.exports = router;
