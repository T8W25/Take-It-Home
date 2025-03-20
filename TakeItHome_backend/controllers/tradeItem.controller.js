const TradeItem = require("../models/tradeItem.model.js");

// GET ALL TRADE ITEMS
const getTradeItems = async (req, res) => {
    try {
        const tradeItems = await TradeItem.find().populate("userId", "name email"); // Include user details
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

        const { title, description, category, condition } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // Validate required fields
        if (!title || !description || !category || !condition) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newTradeItem = new TradeItem({
            userId: req.user.id, // Assign logged-in user ID
            title,
            description,
            category,
            condition,
            imageUrl,
            status: "available"
        });

        await newTradeItem.save();
        res.status(201).json({ message: "Trade item created successfully", tradeItem: newTradeItem });

    } catch (error) {
        console.error("Create Trade Item Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// UPDATE A TRADE ITEM (Only by Owner)
const updateTradeItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, condition } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const tradeItem = await TradeItem.findById(id);
        if (!tradeItem) return res.status(404).json({ message: "Trade item not found" });

        // Check if the logged-in user is the owner
        if (tradeItem.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: You can only update your own items" });
        }

        tradeItem.title = title || tradeItem.title;
        tradeItem.description = description || tradeItem.description;
        tradeItem.category = category || tradeItem.category;
        tradeItem.condition = condition || tradeItem.condition;
        tradeItem.imageUrl = imageUrl || tradeItem.imageUrl;
        tradeItem.updatedAt = Date.now();

        await tradeItem.save();
        res.status(200).json({ message: "Trade item updated successfully", tradeItem });

    } catch (error) {
        console.error("Update Trade Item Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// DELETE A TRADE ITEM (Only by Owner)
const deleteTradeItem = async (req, res) => {
    try {
        const { id } = req.params;

        const tradeItem = await TradeItem.findById(id);
        if (!tradeItem) return res.status(404).json({ message: "Trade item not found" });

        // Check if the logged-in user is the owner
        if (tradeItem.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: You can only delete your own items" });
        }

        tradeItem.status = "deleted";
        await tradeItem.save();

        res.status(200).json({ message: "Trade item marked as deleted", tradeItem });

    } catch (error) {
        console.error("Delete Trade Item Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// EXPORT ALL FUNCTIONS
module.exports = {
    getTradeItems,
    createTradeItem,
    updateTradeItem,
    deleteTradeItem,
};
