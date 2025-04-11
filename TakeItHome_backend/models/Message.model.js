// models/Message.model.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'itemModel'  // Dynamic reference
  },
  itemModel: {
    type: String,
    required: true,
    enum: ['DonationItem', 'TradeItem']  // Correct enum values
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});

module.exports = mongoose.model('Message', messageSchema);
