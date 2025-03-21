
const TradeItem = require("../models/tradeItem.model.js");
const mongoose = require("mongoose");

// GET ALL TRADE ITEMS
const getTradeItems = async (req, res) => {
    try {
        const tradeItems = await TradeItem.find();
        res.status(200).json(tradeItems);
    } catch (error) {
        console.error("Fetch Trade Items Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// CREATE A NEW TRADE ITEM (Only Authenticated Users)
const createTradeItem = async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: Please log in" });
        }

        const { itemName, description, category, condition } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // Validate required fields
        if (!itemName || !description || !category || !condition) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newTradeItem = new TradeItem({
            itemName,
            description,
            category,
            condition,
            imageUrl,
        });

        await newTradeItem.save();
        res.status(201).json({ message: "Trade item created successfully", tradeItem: newTradeItem });

    } catch (error) {
        console.error("Create Trade Item Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// EXPORT ALL FUNCTIONS
module.exports = {
    getTradeItems,
    createTradeItem,
};

