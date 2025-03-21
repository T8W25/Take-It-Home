
const mongoose = require("mongoose");

const tradeItemSchema = new mongoose.Schema({
<<<<<<< HEAD
    title: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    description: { type: String, required: true },
=======
    itemName: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
>>>>>>> b62f5b68908076c31bddb6695cab3d4ae1a97612
    imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("TradeItem", tradeItemSchema);
