const mongoose = require("mongoose");

const TradeItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userType: { type: String, enum: ["trader", "donor"], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    category: { type: String },
    condition: { type: String, enum: ["new", "used"], required: true },
    status: { type: String, enum: ["available", "traded", "deleted"], default: "available" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
});

module.exports = mongoose.model("TradeItem", TradeItemSchema);
