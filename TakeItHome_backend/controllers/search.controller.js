const TradeItem = require("../models/tradeItem.model");
const DonationItem = require("../models/DonationItem.model");

// Search Trade Items
exports.searchTradeItems = async (req, res) => {
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

        const items = await TradeItem.find(query).populate("user", "name email");
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Search Donation Items
exports.searchDonationItems = async (req, res) => {
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

        const items = await DonationItem.find(query);
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
