const DonationItem = require("../models/DonationItem.model");

// ✅ GET ALL DONATION ITEMS
const getDonationItems = async (req, res) => {
  try {
    const donations = await DonationItem.find();
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ CREATE A NEW DONATION ITEM
const createDonationItem = async (req, res) => {
  try {
    const { title, category, condition, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !category || !condition || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newDonationItem = new DonationItem({
      title,
      category,
      condition,
      description,
      imageUrl,
    });

    await newDonationItem.save();
    res.status(201).json({ message: "Donation item created", donationItem: newDonationItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getDonationItems, createDonationItem };
