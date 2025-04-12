const mongoose = require("mongoose");

const donationItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    videoUrl: { type: String },
    sold: { type: Boolean, default: false },
    location: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    donated: { type: Boolean, default: false } // ✅ New field
  },
  { timestamps: true }
);

module.exports = mongoose.model("DonationItem", donationItemSchema);
