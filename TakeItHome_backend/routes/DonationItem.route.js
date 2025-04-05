// ✅ Final: DonationItem.route.js
const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authmiddleware");
const upload = require("../middleware/multer.middleware");

const {
  getDonationItems,
  createDonationItem,
  updateDonationItem,
  deleteDonationItem,
  searchDonationItems,
  getDonationItemById,
  getMyDonationItems
} = require("../controllers/donationItem.controller");

// ✅ ROUTES


// Get all donation items
router.get("/all", getDonationItems);

// Create a new donation item with image/video
router.post(
  "/post",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createDonationItem
);

// Update donation item
router.put("/edit/:id", verifyToken, updateDonationItem);

// Delete donation item
router.delete("/delete/:id", verifyToken, deleteDonationItem);

// Search or get by ID
router.get("/search", searchDonationItems);
router.get("/:id", getDonationItemById);

router.get("/my-posts", verifyToken, getMyDonationItems);

module.exports = router;
