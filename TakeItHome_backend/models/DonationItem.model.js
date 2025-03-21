const mongoose = require("mongoose");

const donationItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  condition: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },  // Store image URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DonationItem", donationItemSchema);
