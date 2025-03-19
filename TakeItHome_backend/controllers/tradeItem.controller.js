const TradeItem = require("../models/tradeItem.model.js");

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
        const { userId, userType, title, description, category, condition } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const newTradeItem = new TradeItem({
            userId,
            userType,
            title,
            description,
            imageUrl,
            category,
            condition,
            status: "available"
        });

        await newTradeItem.save();
        res.status(201).json({ message: "Trade item created successfully", tradeItem: newTradeItem });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//  UPDATE A TRADE ITEM
const updateTradeItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, condition } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const tradeItem = await TradeItem.findById(id);
        if (!tradeItem) return res.status(404).json({ message: "Trade item not found" });

        tradeItem.title = title || tradeItem.title;
        tradeItem.description = description || tradeItem.description;
        tradeItem.category = category || tradeItem.category;
        tradeItem.condition = condition || tradeItem.condition;
        tradeItem.imageUrl = imageUrl || tradeItem.imageUrl;
        tradeItem.updatedAt = Date.now();

        await tradeItem.save();
        res.status(200).json({ message: "Trade item updated successfully", tradeItem });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//  DELETE A TRADE ITEM (Soft Delete)
const deleteTradeItem = async (req, res) => {
    try {
        const { id } = req.params;

        const tradeItem = await TradeItem.findById(id);
        if (!tradeItem) return res.status(404).json({ message: "Trade item not found" });

        tradeItem.status = "deleted";
        await tradeItem.save();

        res.status(200).json({ message: "Trade item marked as deleted", tradeItem });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// EXPORT ALL FUNCTIONS
module.exports = {
    getTradeItems,
    createTradeItems,
    updateTradeItem,
    deleteTradeItem,
};
