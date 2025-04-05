const mongoose = require("mongoose");

const tradeItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String },
    videoUrl: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// ✅ FIX: Only register the model once
module.exports = mongoose.models.TradeItem || mongoose.model("TradeItem", tradeItemSchema);
