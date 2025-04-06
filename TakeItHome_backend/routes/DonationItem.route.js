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
  getDonationItemsByUser
} = require("../controllers/donationItem.controller");

// ✅ Get all donation items
router.get("/all", getDonationItems);

+// ✅ Get only the logged‑in user’s donation items
+router.get("/user", verifyToken, getDonationItemsByUser);

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

-// This was catching “user” as an ID
-// router.get("/:id", getDonationItemById);
+// ✅ Get donation item by its ID
+router.get("/:id", getDonationItemById);

module.exports = router;
