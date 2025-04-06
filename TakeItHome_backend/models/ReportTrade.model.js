const mongoose = require('mongoose');

const reportTradeSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TradeItem',  // Assuming you're reporting trade items
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ReportTrade = mongoose.model('ReportTrade', reportTradeSchema);
module.exports = ReportTrade;
