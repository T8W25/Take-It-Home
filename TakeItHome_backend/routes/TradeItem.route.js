const express = require("express");
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

module.exports = router;
