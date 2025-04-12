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


// Updated route to mark as sold
router.put("/mark-sold/:id", verifyToken, async (req, res) => {
  try {
    const DonationItem = require("../models/DonationItem.model");
    const itemId = req.params.id;
    const userId = req.user.id;
    if (!itemId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }
    const item = await DonationItem.findOne({ _id: itemId, userId });
    if (!item) {
      return res.status(404).json({ message: "Donation item not found or you are not authorized" });
    }
    item.sold = true;
    const savedItem = await item.save();
    // Verify database state
    const verifiedItem = await DonationItem.findById(itemId);
    console.log("Donation item saved:", savedItem);
    console.log("Donation item verified in DB:", verifiedItem);
    if (!verifiedItem.sold) {
      throw new Error("Failed to persist sold status in database");
    }
    res.json({ message: "Donation item marked as sold", item: savedItem });
  } catch (err) {
    console.error("Mark sold error (Donation):", err);
    res.status(500).json({ message: `Failed to mark donation item as sold: ${err.message}` });
  }
});

router.get("/all", async (req, res) => {
  try {
    const DonationItem = require("../models/DonationItem.model");
    const items = await DonationItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
