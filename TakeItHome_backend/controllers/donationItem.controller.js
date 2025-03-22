// ✅ DonationItem.controller.js (Backend Logic for Donation Posts)
const DonationItem = require("../models/DonationItem.model");

// GET All Donation Items
const getDonationItems = async (req, res) => {
  try {
    const items = await DonationItem.find();
    res.status(200).json(items);
  } catch (error) {
    console.error("❌ Fetch Donation Items Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// POST a New Donation Item
const createDonationItem = async (req, res) => {
  try {
    const { title, category, condition, description } = req.body;
    const imageUrl = req.files?.image ? `/uploads/${req.files.image[0].filename}` : null;
    const videoUrl = req.files?.video ? `/uploads/${req.files.video[0].filename}` : null;

    if (!title || !category || !condition || !description || (!imageUrl && !videoUrl)) {
      return res.status(400).json({ message: "All fields are required with at least one media." });
    }

    const newItem = new DonationItem({
      title,
      category,
      condition,
      description,
      imageUrl,
      videoUrl,
    });

    await newItem.save();
    res.status(201).json({ message: "Donation item created", donationItem: newItem });
  } catch (error) {
    console.error("❌ Create Donation Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getDonationItems,
  createDonationItem,
};
