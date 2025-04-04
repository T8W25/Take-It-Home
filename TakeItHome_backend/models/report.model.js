const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TradeItem',  // Reference to the TradeItem model
    required: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model for the user who reported
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
