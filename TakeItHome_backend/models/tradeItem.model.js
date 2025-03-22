const mongoose = require("mongoose");

const tradeItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true }, // Made location required like in DonationItem model
    imageUrl: { type: String }, // Image URL is now optional
    videoUrl: { type: String }, // Video URL is now optional
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Added userId reference to User model
  },
  { timestamps: true }
);

module.exports = mongoose.model("TradeItem", tradeItemSchema);
