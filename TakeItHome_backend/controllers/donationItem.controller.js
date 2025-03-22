// ✅ donationItem.controller.js (Fully Fixed)
const DonationItem = require("../models/DonationItem.model");

// ✅ GET: All donation items
const getDonationItems = async (req, res) => {
  try {
    const items = await DonationItem.find();
    res.status(200).json(items);
  } catch (error) {
    console.error("❌ Fetch Donation Items Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ POST: Create new donation item
const createDonationItem = async (req, res) => {
  try {
    const { title, category, condition, description } = req.body;
    const imageUrl = req.files?.image?.[0] ? `/uploads/${req.files.image[0].filename}` : null;
    const videoUrl = req.files?.video?.[0] ? `/uploads/${req.files.video[0].filename}` : null;

    if (!title || !category || !condition || !description || (!imageUrl && !videoUrl)) {
      return res.status(400).json({ message: "All fields and at least one media are required." });
    }

    // ✅ Log for debugging
    console.log("User from token:", req.user);

    const newItem = new DonationItem({
      title,
      category,
      condition,
      description,
      imageUrl,
      videoUrl,
      userId: req.user.id // ✅ This must be here
    });
    
    await newItem.save();
    res.status(201).json({ message: "Donation item created", donationItem: newItem });
  } catch (error) {
    console.error("❌ Create Donation Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ PUT: Edit donation item
// updateDonationItem
const updateDonationItem = async (req, res) => {
  try {
    const item = await DonationItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // ✅ Check if userId exists before calling toString()
    if (!item.userId || item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { title, category, condition, description } = req.body;
    item.title = title;
    item.category = category;
    item.condition = condition;
    item.description = description;

    await item.save();
    res.status(200).json({ message: "Item updated", item });
  } catch (err) {
    console.error("❌ Update Donation Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ✅ DELETE: Remove donation item
// deleteDonationItem
const deleteDonationItem = async (req, res) => {
  try {
    const item = await DonationItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (!item.userId || item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await item.deleteOne();
    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    console.error("❌ Delete Donation Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = {
  getDonationItems,
  createDonationItem,
  updateDonationItem,
  deleteDonationItem,
};
