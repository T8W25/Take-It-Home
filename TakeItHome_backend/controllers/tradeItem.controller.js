const TradeItem = require("../models/tradeItem.model.js");
const mongoose = require("mongoose");

//  GET ALL TRADE ITEMS
const getTradeItems = async (req, res) => {
    try {
        const tradeItems = await TradeItem.find();
        res.status(200).json(tradeItems);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//  CREATE A NEW TRADE ITEM
const createTradeItems = async (req, res) => {
    try {
        console.log("Received Request:", req.body);
        
        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: Please log in" });
        }

        const { title, category, condition, description } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // Validate required fields
        if (!title || !category || !condition || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        console.log("Request Passed Validation");

        const newTradeItem = new TradeItem({
            title,
            category,
            condition,
            description,
            imageUrl
        });

        await newTradeItem.save();
        console.log("Item Saved:", newTradeItem);

        res.status(201).json({ message: "Trade item created", tradeItem: newTradeItem });

    } catch (error) {
        console.error("Trade Item Creation Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// EXPORT ALL FUNCTIONS
module.exports = {
    getTradeItems,
    createTradeItems
};
