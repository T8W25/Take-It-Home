// tradeRequest.controller.js
const TradeRequest = require("../models/TradeRequest.model");
const TradeItem = require("../models/tradeItem.model");
const User = require("../models/User.model");

// ✅ GET: All trade requests for a specific trader (user)
const getTradeRequestsForTrader = async (req, res) => {
  try {
    const tradeRequests = await TradeRequest.find({ tradeItemId: { $in: req.user.tradeItemIds } }).populate('requesterId tradeItemId');
    res.status(200).json(tradeRequests);
  } catch (error) {
    console.error("❌ Fetch Trade Requests Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ POST: Create new trade request
const createTradeRequest = async (req, res) => {
  try {
    const { tradeItemId, message } = req.body;

    // Ensure the trade item exists
    const tradeItem = await TradeItem.findById(tradeItemId);
    if (!tradeItem) return res.status(404).json({ message: "Trade item not found" });

    const newRequest = new TradeRequest({
      tradeItemId,
      requesterId: req.user.id,
      message,
    });

    await newRequest.save();
    res.status(201).json({ message: "Trade request created", tradeRequest: newRequest });
  } catch (error) {
    console.error("❌ Create Trade Request Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ PUT: Accept or decline a trade request
const updateTradeRequestStatus = async (req, res) => {
  try {
    const tradeRequest = await TradeRequest.findById(req.params.id);
    if (!tradeRequest) return res.status(404).json({ message: "Trade request not found" });

    // Ensure the user is the trader (owner of the trade item)
    const tradeItem = await TradeItem.findById(tradeRequest.tradeItemId);
    if (!tradeItem || tradeItem.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { status } = req.body;
    if (["accepted", "declined"].includes(status)) {
      tradeRequest.status = status;
      await tradeRequest.save();
      res.status(200).json({ message: `Trade request ${status}`, tradeRequest });
    } else {
      res.status(400).json({ message: "Invalid status" });
    }
  } catch (error) {
    console.error("❌ Update Trade Request Status Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getTradeRequestsForTrader,
  createTradeRequest,
  updateTradeRequestStatus,
};
