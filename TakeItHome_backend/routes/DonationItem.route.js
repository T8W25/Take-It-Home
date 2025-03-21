const express = require("express");
const multer = require("multer");
const { getDonationItems, createDonationItem } = require("../controllers/donationItem.controller");

const router = express.Router();

// ✅ Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// ✅ Routes
router.get("/", getDonationItems);  // Get all donations
router.post("/", upload.single("image"), createDonationItem);  // Post a donation

module.exports = router;
