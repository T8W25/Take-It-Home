// TradeRequest.model.js
const mongoose = require("mongoose");

const tradeRequestSchema = new mongoose.Schema(
  {
    tradeItemId: { type: mongoose.Schema.Types.ObjectId, ref: "TradeItem", required: true },
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    message: { type: String, default: "" }, // Optionally, the requester can add a message.
  },
  { timestamps: true }
);

module.exports = mongoose.model("TradeRequest", tradeRequestSchema);
