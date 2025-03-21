const mongoose = require("mongoose");

const tradeItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Standardized field name
    description: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TradeItem", tradeItemSchema);
