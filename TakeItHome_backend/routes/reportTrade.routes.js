const express = require('express');
const jwt = require('jsonwebtoken');
const reportTradeController = require('../controllers/reportTrade.controller');

const router = express.Router();

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Report a trade item
router.post('/report/:itemId', verifyToken, reportTradeController.reportTrade);

module.exports = router;
