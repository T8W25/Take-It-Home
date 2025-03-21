const TradeItem = require("../models/tradeItem.model");

// **GET ALL TRADE ITEMS**
const getTradeItems = async (req, res) => {
  try {
    const tradeItems = await TradeItem.find().populate("user", "name email"); // Include user details
    res.status(200).json(tradeItems);
  } catch (error) {
    console.error("Fetch Trade Items Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// **CREATE A NEW TRADE ITEM**
const createTradeItem = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    const { title, description, category, condition } = req.body;
    let imageUrl = req.files?.image ? `/uploads/${req.files.image[0].filename}` : "";
    let videoUrl = req.files?.video ? `/uploads/${req.files.video[0].filename}` : ""; // Video upload

    if (!title || !description || !category || !condition) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTradeItem = new TradeItem({
      user: req.user.id,
      title,
      description,
      category,
      condition,
      imageUrl,
      videoUrl,
    });

    await newTradeItem.save();
    res.status(201).json({ message: "Trade item created successfully", tradeItem: newTradeItem });
  } catch (error) {
    console.error("Create Trade Item Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getTradeItems, createTradeItem };