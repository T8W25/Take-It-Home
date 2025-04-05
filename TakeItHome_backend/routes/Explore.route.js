const express = require('express');
const router = express.Router();

const DonationItem = require('../models/DonationItem.model');
const TradeItem = require('../models/TradeItem.model');

// GET /api/items - combine donation and trade items
router.get('/', async (req, res) => {
  try {
    const donations = await DonationItem.find().lean();
    const trades = await TradeItem.find().lean();

    const allItems = [...donations, ...trades].map(item => ({
      _id: item._id,
      title: item.title,
      description: item.description,
      image: item.image,
      type: item.category ? 'donate' : 'trade' // or adjust based on your model
    }));

    res.json(allItems);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
