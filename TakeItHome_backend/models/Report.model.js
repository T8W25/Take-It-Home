const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reportType: {
    type: String,
    enum: ["item", "user"],
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item", // Reference to the Item model (if reportType is item)
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model (if reportType is user)
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending",  // Report status (pending by default)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
