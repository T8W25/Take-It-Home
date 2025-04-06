const DonationItem = require("../models/DonationItem.model");

// ✅ Get all donation items
const getDonationItems = async (req, res) => {
  try {
    const items = await DonationItem.find();
    res.status(200).json(items);
  } catch (error) {
    console.error("❌ Fetch Donation Items Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get donation item by ID
const getDonationItemById = async (req, res) => {
  try {
    const item = await DonationItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Donation item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    console.error("❌ Fetch by ID Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Create new donation item
const createDonationItem = async (req, res) => {
  try {
    const { title, category, condition, description, location } = req.body;
    const imageUrl = req.files?.image?.[0] ? `/uploads/${req.files.image[0].filename}` : null;
    const videoUrl = req.files?.video?.[0] ? `/uploads/${req.files.video[0].filename}` : null;

    if (!title || !category || !condition || !description || !location || (!imageUrl && !videoUrl)) {
      return res.status(400).json({ message: "All fields and at least one media file are required." });
    }

    const newItem = new DonationItem({
      title,
      category,
      condition,
      description,
      location,
      imageUrl,
      videoUrl,
      userId: req.user.id,
    });

    await newItem.save();
    res.status(201).json({ message: "Donation item created", donationItem: newItem });
  } catch (error) {
    console.error("❌ Create Donation Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Update donation item
const updateDonationItem = async (req, res) => {
  try {
    const item = await DonationItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { title, category, condition, description, location } = req.body;
    Object.assign(item, { title, category, condition, description, location });

    await item.save();
    res.status(200).json({ message: "Item updated", item });
  } catch (error) {
    console.error("❌ Update Donation Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Delete donation item
const deleteDonationItem = async (req, res) => {
  try {
    const item = await DonationItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await item.deleteOne();
    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    console.error("❌ Delete Donation Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Search donation items
const searchDonationItems = async (req, res) => {
  try {
    const { q, category, location } = req.query;
    const query = {};

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }
    if (category) query.category = category;
    if (location) query.location = location;

    const items = await DonationItem.find(query);
    res.status(200).json(items);
  } catch (error) {
    console.error("❌ Search Donation Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// DonationItem.controller.js
const getMyDonationItems = async (req, res) => {
  try {
    const items = await DonationItem.find({ userId: req.user.id }); // Match model field
    console.log("Fetched My Donation Items:", items); // Debug log
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ New: fetch only the logged‑in user’s donation items
const getDonationItemsByUser = async (req, res) => {
  try {
    const items = await DonationItem.find({ userId: req.user.id });
    res.status(200).json(items);
  } catch (error) {
    console.error("❌ Fetch User Donation Items Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getDonationItems,
  getDonationItemById,
  createDonationItem,
  updateDonationItem,
  deleteDonationItem,
  searchDonationItems,
  getMyDonationItems,
  getDonationItemsByUser
};
