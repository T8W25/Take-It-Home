const fs = require("fs");
const TradeItem = require('../models/tradeItem.model');

// ✅ GET: All trade items with user info
const getTradeItems = async (req, res) => {
  try {
    const items = await TradeItem.find().populate("userId", "username profileImage");
    res.status(200).json(items);
  } catch (error) {
    console.error("❌ Fetch Trade Items Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const createTradeItem = async (req, res) => {
  try {
    const { title, category, condition, description, location } = req.body;
    const imageFile = req.files?.image?.[0];

    if (!title || !category || !condition || !description || !location || !imageFile) {
      return res.status(400).json({ message: "All fields including an image are required." });
    }

    const imageBuffer = fs.readFileSync(imageFile.path);
    const imageBase64 = imageBuffer.toString("base64");
    const mimeType = imageFile.mimetype;
    const base64String = `data:${mimeType};base64,${imageBase64}`;

    const newItem = new TradeItem({
      title,
      category,
      condition,
      description,
      location,
      imageBase64: base64String, // ✅ saving base64 string
      userId: req.user.id,
    });

    await newItem.save();
    fs.unlinkSync(imageFile.path); // ✅ delete after encoding
    res.status(201).json({ message: "Trade item created", tradeItem: newItem });
  } catch (error) {
    console.error("❌ Create Trade Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// ✅ PUT: Update existing trade item with base64 image support
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
      const imageBuffer = fs.readFileSync(req.files.image[0].path);
      updates.imageBase64 = `data:${req.files.image[0].mimetype};base64,${imageBuffer.toString("base64")}`;
      fs.unlinkSync(req.files.image[0].path);
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

// ✅ GET: Search trade items
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

    const items = await TradeItem.find(query).populate("userId", "username profileImage");
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Search error", error: error.message });
  }
};

// ✅ GET: Single item by ID
const getTradeItemById = async (req, res) => {
  try {
    const item = await TradeItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// TradeItem.controller.js
const getMyTradeItems = async (req, res) => {
  try {
    const items = await TradeItem.find({ userId: req.user.id }); // Match model field
    console.log("Fetched My Trade Items:", items); // Debug log
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ New: fetch only the logged‑in user’s trade items
const getTradeItemsByUser = async (req, res) => {
  try {
    const items = await TradeItem
      .find({ userId: req.user.id })
      .populate("userId", "username profileImage");
    res.status(200).json(items);
  } catch (error) {
    console.error("❌ Fetch User Trade Items Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


module.exports = {
  getTradeItems,
  createTradeItem,
  updateTradeItem,
  deleteTradeItem,
  searchTradeItems,
  getTradeItemById,
  getMyTradeItems,
  getTradeItemsByUser
};
