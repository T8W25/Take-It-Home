// ✅ File: controllers/tradeItem.controller.js
const TradeItem = require("../models/tradeItem.model");

// ✅ GET: All trade items
const getTradeItems = async (req, res) => {
  try {
    const items = await TradeItem.find();
    res.status(200).json(items);
  } catch (error) {
    console.error("❌ Fetch Trade Items Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ POST: Create new trade item
const createTradeItem = async (req, res) => {
  try {
    const { title, category, condition, description, location } = req.body;
    const imageUrl = req.files?.image?.[0] ? `/uploads/${req.files.image[0].filename}` : null;
    const videoUrl = req.files?.video?.[0] ? `/uploads/${req.files.video[0].filename}` : null;

    if (!title || !category || !condition || !description || !location || (!imageUrl && !videoUrl)) {
      return res.status(400).json({ message: "All fields and at least one media are required." });
    }

    const newItem = new TradeItem({
      title,
      category,
      condition,
      description,
      location,
      imageUrl,
      videoUrl,
      userId: req.user.id
    });

    await newItem.save();
    res.status(201).json({ message: "Trade item created", tradeItem: newItem });
  } catch (error) {
    console.error("❌ Create Trade Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ PUT: Update trade item
const updateTradeItem = async (req, res) => {
  try {
    const item = await TradeItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (!req.user || item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updates = {
      title: req.body.title,
      category: req.body.category,
      condition: req.body.condition,
      description: req.body.description,
      location: req.body.location
    };

    if (req.files?.image?.[0]) {
      updates.imageUrl = `/uploads/${req.files.image[0].filename}`;
    }
    if (req.files?.video?.[0]) {
      updates.videoUrl = `/uploads/${req.files.video[0].filename}`;
    }

    const updatedItem = await TradeItem.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ message: "Item updated", tradeItem: updatedItem });
  } catch (error) {
    console.error("❌ Update Trade Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ DELETE: Remove trade item
const deleteTradeItem = async (req, res) => {
  try {
    const item = await TradeItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Trade item not found" });

    if (!req.user || item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await item.deleteOne();
    res.status(200).json({ message: "Trade item deleted" });
  } catch (error) {
    console.error("❌ Delete Trade Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ SEARCH Items
const searchTradeItems = async (req, res) => {
  try {
    const { q, category, location } = req.query;
    const query = {};
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }
    if (category) query.category = category;
    if (location) query.location = location;

    const items = await TradeItem.find(query);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Search error", error: error.message });
  }
};

// ✅ GET by ID
const getTradeItemById = async (req, res) => {
  try {
    const item = await TradeItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Trade item not found" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Fetch by ID error", error: error.message });
  }
};

module.exports = {
  getTradeItems,
  createTradeItem,
  updateTradeItem,
  deleteTradeItem,
  searchTradeItems,
  getTradeItemById
};
