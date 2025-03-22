const mongoose = require("mongoose");

const tradeItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String }, // Optional
    imageUrl: { type: String, default: "" }, // ✅ Comma added before this
    videoUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TradeItem", tradeItemSchema);
