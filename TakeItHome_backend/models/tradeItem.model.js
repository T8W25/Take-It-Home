const mongoose = require("mongoose");

const tradeItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, default: "" }, // Image URL
    videoUrl: { type: String, default: "" }, // Video URL (optional)
  },
  { timestamps: true }
);

module.exports = mongoose.model("TradeItem", tradeItemSchema);
