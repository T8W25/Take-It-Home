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
const createTradeItem = async (req, res) => {
  try {
    const { title, category, condition, description } = req.body;
    const imageUrl = req.files?.image?.[0] ? `/uploads/${req.files.image[0].filename}` : null;
    const videoUrl = req.files?.video?.[0] ? `/uploads/${req.files.video[0].filename}` : null;

    if (!title || !category || !condition || !description || (!imageUrl && !videoUrl)) {
      return res.status(400).json({ message: "All fields and at least one media are required." });
    }

    const newItem = new TradeItem({ title, category, condition, description, imageUrl, videoUrl });
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
