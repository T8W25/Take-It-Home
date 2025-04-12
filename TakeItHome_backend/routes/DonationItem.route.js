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
  getDonationItemsByUser,
  markAsDonated
} = require("../controllers/donationItem.controller");

router.get("/all", getDonationItems);
router.get("/user", verifyToken, getDonationItemsByUser);

// ✅ Get only the logged-in user’s donation items
router.get("/user", verifyToken, getDonationItemsByUser);

// ✅ Create a new donation item with image/video
router.post(
  "/post",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  createDonationItem
);

// ✅ Update a donation item with image/video
router.put(
  "/edit/:id",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updateDonationItem
);

// ✅ Delete a donation item
router.delete("/delete/:id", verifyToken, deleteDonationItem);

// ✅ Search or get by ID
router.put("/edit/:id", verifyToken, updateDonationItem);
router.delete("/delete/:id", verifyToken, deleteDonationItem);
router.get("/search", searchDonationItems);
router.get("/:id", getDonationItemById);

// ✅ Get donation item by its ID
router.get("/:id", getDonationItemById);
// ✅ Mark as donated
router.put("/donated/:id", verifyToken, markAsDonated);

module.exports = router;
