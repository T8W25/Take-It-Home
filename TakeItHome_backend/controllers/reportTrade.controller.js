const ReportTrade = require('../models/ReportTrade.model');
const TradeItem = require('../models/tradeItem.model');  // Assuming you have a TradeItem model
const User = require('../models/User.model');  // Assuming you have a User model

// Report a trade item
const reportTrade = async (req, res) => {
  const { itemId } = req.params;
  const { reason } = req.body;
  const userId = req.user.id;

  if (!reason) {
    return res.status(400).json({ message: 'Reason is required' });
  }

  try {
    // Check if the item exists
    const item = await TradeItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Create the report
    const report = new ReportTrade({
      itemId,
      userId,
      reason,
    });

    await report.save();

    // Send a response
    return res.status(201).json({ message: 'Report submitted successfully' });
  } catch (error) {
    console.error('Error reporting item:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  reportTrade,
};
