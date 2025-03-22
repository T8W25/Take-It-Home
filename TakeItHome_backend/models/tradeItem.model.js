const mongoose = require("mongoose");

const tradeItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    description: { type: String, required: true },

    imageUrl: { type: String },
    videoUrl: { type: String }

    imageUrl: { type: String, default: "" }, // Image URL
    videoUrl: { type: String, default: "" }, // Video URL (optional)
    location: { type: String, required: true }, // Location (optional)

  },
  { timestamps: true }
);

module.exports = mongoose.model("TradeItem", tradeItemSchema);
