const express = require("express");
const router = express.Router();
const multer = require("multer");
const { authenticate } = require("../middleware/authMiddleware");
const { createDonationItem, getDonationItems, searchDonationItems } = require("../controllers/DonationItem.controller");


// Multer Storage Config
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.get("/all", getDonationItems);
router.post(
  "/post",
  authenticate,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createDonationItem
);

router.get("/search", searchDonationItems);

module.exports = router;
