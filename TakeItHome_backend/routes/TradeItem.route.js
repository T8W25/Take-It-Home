const express = require("express");
const { postTradeItem, getAllTradeItems } = require("../controllers/tradeItem.controller");
const { authenticate } = require("../middleware/authMiddleware");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/post", authenticate, upload.single("image"), postTradeItem); // Only logged-in users
router.get("/all", getAllTradeItems); // Publicly accessible

module.exports = router;
