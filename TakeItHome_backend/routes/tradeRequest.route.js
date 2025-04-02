// tradeRequest.route.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authmiddleware");
const {
  getTradeRequestsForTrader,
  createTradeRequest,
  updateTradeRequestStatus,
} = require("../controllers/tradeRequest.controller");

// Routes
router.get("/for-trader", verifyToken, getTradeRequestsForTrader); // Get all requests for the trader
router.post("/create", verifyToken, createTradeRequest); // Create a new trade request
router.put("/update/:id", verifyToken, updateTradeRequestStatus); // Accept or decline a trade request
router.get("/test", (req, res) => {
    res.send("Trade request routes are working!");
  });
  
module.exports = router;
