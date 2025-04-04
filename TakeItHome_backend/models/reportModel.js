// models/reportModel.js

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DonationItem',  // Assuming you have a DonationItem model for items
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming you have a User model for users
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: ['Inappropriate Content', 'Fraudulent', 'Spam', 'Other'],  // Add any other reasons you want
  },
  reportedAt: {
    type: Date,
    default: Date.now,
  }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
