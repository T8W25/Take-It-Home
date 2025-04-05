// ✅ DonationItem.model.js
const mongoose = require("mongoose");

const donationItemSchema = new mongoose.Schema(
  {
    

    title: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    videoUrl: { type: String },
    location: { type: String, required: true }, // ✅ This line is now safe
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DonationItem", donationItemSchema);
