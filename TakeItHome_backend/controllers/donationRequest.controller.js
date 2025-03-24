const DonationRequest = require('../models/DonationRequest.model');
const Notification = require('../models/Notification');
const DonationItem = require('../models/DonationItem.model');

exports.createDonationRequest = async (req, res) => {
  try {
    const { itemId, requesterId } = req.body;
    const item = await DonationItem.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const request = await DonationRequest.create({ item: itemId, requester: requesterId });

    await Notification.create({
      recipient: item.userId,
      message: `You have a new donation request for: ${item.title}`,
    });

    res.status(201).json({ message: 'Request sent', request });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};
