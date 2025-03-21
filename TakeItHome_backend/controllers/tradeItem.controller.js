
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
<<<<<<< HEAD
        console.log("Received Request:", req.body);
        
        const { title, category, condition, description } = req.body;
        if (!title || !category || !condition || !description) {
=======
        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: Please log in" });
        }

        const { itemName, description, category, condition } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // Validate required fields
        if (!itemName || !description || !category || !condition) {
>>>>>>> b62f5b68908076c31bddb6695cab3d4ae1a97612
            return res.status(400).json({ message: "All fields are required" });
        }

        console.log("Request Passed Validation");

        const newTradeItem = new TradeItem({
<<<<<<< HEAD
            title,
            category,
            condition,
            description,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
=======
            itemName,
            description,
            category,
            condition,
            imageUrl,
>>>>>>> b62f5b68908076c31bddb6695cab3d4ae1a97612
        });

        await newTradeItem.save();
        console.log("Item Saved:", newTradeItem);

        res.status(201).json({ message: "Trade item created", tradeItem: newTradeItem });

    } catch (error) {
        console.error("Trade Item Creation Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

<<<<<<< HEAD

// EXPORT ALL FUNCTIONS
module.exports = {
    getTradeItems,
    createTradeItems,
=======
// EXPORT ALL FUNCTIONS
module.exports = {
    getTradeItems,
    createTradeItem,
>>>>>>> b62f5b68908076c31bddb6695cab3d4ae1a97612
};

