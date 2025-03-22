const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authmiddleware");
const upload = require("../middleware/multer.middleware");

const {
  getDonationItems,
  createDonationItem,
  updateDonationItem,
  deleteDonationItem,
} = require("../controllers/donationItem.controller");

// Routes
router.get("/all", getDonationItems);
router.post("/post", verifyToken, upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 }
]), createDonationItem);

router.put("/edit/:id", verifyToken, updateDonationItem);
router.delete("/delete/:id", verifyToken, deleteDonationItem);

module.exports = router;
