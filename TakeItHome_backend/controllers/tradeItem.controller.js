// ✅ tradeItem.controller.js
const TradeItem = require("../models/tradeItem.model");
const mongoose = require("mongoose");

// GET all trade items
const getTradeItems = async (req, res) => {
  try {
    const tradeItems = await TradeItem.find();
    res.status(200).json(tradeItems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST new trade item
const createTradeItem = async (req, res) => {
  try {
    const { title, description, category, condition } = req.body;

    if (!title || !description || !category || !condition) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTradeItem = new TradeItem({
      title,
      description,
      category,
      condition,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newTradeItem.save();
    res.status(201).json({ message: "Item posted successfully", tradeItem: newTradeItem });
  } catch (error) {
    console.error("Trade Item Creation Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getTradeItems,
  createTradeItem,
};
