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

router.post(
  "/post",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  createDonationItem
);

router.put("/edit/:id", verifyToken, updateDonationItem);
router.delete("/delete/:id", verifyToken, deleteDonationItem);
router.get("/search", searchDonationItems);
router.get("/:id", getDonationItemById);

// ✅ Mark as donated
router.put("/donated/:id", verifyToken, markAsDonated);

module.exports = router;
