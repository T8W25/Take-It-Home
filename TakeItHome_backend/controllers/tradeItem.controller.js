const TradeItem = require("../models/tradeItem.model");

// GET all trade items
const getTradeItems = async (req, res) => {
  try {
    const items = await TradeItem.find();
    res.status(200).json(items);
  } catch (error) {
    console.error("❌ Fetch Trade Items Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// POST a new trade item
// tradeItem.controller.js

const createTradeItem = async (req, res) => {
  try {
    const { title, description, category, condition, location } = req.body;

    const imageUrl = req.files?.image?.[0]
      ? `/uploads/${req.files.image[0].filename}`
      : null;
    const videoUrl = req.files?.video?.[0]
      ? `/uploads/${req.files.video[0].filename}`
      : null;

    if (!title || !description || !category || !condition || (!imageUrl && !videoUrl)) {
      return res.status(400).json({ message: "All fields and at least one media are required." });
    }

    const newItem = new TradeItem({
      title,
      description,
      category,
      condition,
      location,
      imageUrl,
      videoUrl,
    });

    await newItem.save();

    res.status(201).json({ message: "Trade item created", tradeItem: newItem });
  } catch (error) {
    console.error("❌ Create Trade Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


module.exports = {
  getTradeItems,
  createTradeItem,
};

// **SEARCH TRADE ITEMS**
const searchTradeItems = async (req, res) => {
  try {
    const { q, category, location } = req.query;

    // Build query for search and filters
    const query = {};
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }
    if (category) query.category = category;
    if (location) query.location = location;

    const items = await TradeItem.find(query).populate("user", "name email");
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// **GET TRADE ITEM BY ID**
const getTradeItemById = async (req, res) => {
  try {
    const item = await TradeItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getTradeItems, createTradeItem, searchTradeItems, getTradeItemById };

