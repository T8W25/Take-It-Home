const mongoose = require("mongoose");

const tradeItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    imageBase64: { type: String }, // ✅ base64 encoded image
    videoUrl: { type: String },
    sold: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

// ✅ Fix: prevent OverwriteModelError during dev hot reload
module.exports = mongoose.models.TradeItem || mongoose.model("TradeItem", tradeItemSchema);
