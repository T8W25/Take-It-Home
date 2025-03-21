
const mongoose = require("mongoose");

const tradeItemSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("TradeItem", tradeItemSchema);
