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

// ✅ CREATE: Create a new trade item
const createTradeItem = async (req, res) => {
  try {
    const { title, description, category, condition, location } = req.body;
    const imageUrl = req.files?.image?.[0] ? `/uploads/${req.files.image[0].filename}` : null;
    const videoUrl = req.files?.video?.[0] ? `/uploads/${req.files.video[0].filename}` : null;

    if (!title || !description || !category || !condition || !location || (!imageUrl && !videoUrl)) {
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
      userId: req.user.id, // Assuming the user is authenticated
    });

    await newItem.save();
    res.status(201).json({ message: "Trade item created", tradeItem: newItem });
  } catch (error) {
    console.error("❌ Create Trade Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ UPDATE: Update a trade item by ID
const updateTradeItem = async (req, res) => {
  try {
    const item = await TradeItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (!item.userId || item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { title, description, category, condition, location } = req.body;
    item.title = title;
    item.description = description;
    item.category = category;
    item.condition = condition;
    item.location = location;

    await item.save();
    res.status(200).json({ message: "Item updated", tradeItem: item });
  } catch (err) {
    console.error("❌ Update Trade Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ✅ DELETE: Remove a trade item
const deleteTradeItem = async (req, res) => {
  try {
    const item = await TradeItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (!item.userId || item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await item.deleteOne();
    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    console.error("❌ Delete Trade Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ✅ SEARCH: Search trade items with optional filters
const searchTradeItems = async (req, res) => {
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

    const items = await TradeItem.find(query);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ GET: Trade item by ID
const getTradeItemById = async (req, res) => {
  try {
    const item = await TradeItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Trade item not found" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getTradeItems,
  createTradeItem,
  updateTradeItem,
  deleteTradeItem,
  searchTradeItems,
  getTradeItemById,
};
