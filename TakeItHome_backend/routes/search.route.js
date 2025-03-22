const express = require("express");
const router = express.Router();
const { searchTradeItems, searchDonationItems } = require("../controllers/search.controller");

// Combined Search Route
router.get("/", async (req, res) => {
    const { type } = req.query;

    if (type === "trade") {
        await searchTradeItems(req, res);
    } else if (type === "donation") {
        await searchDonationItems(req, res);
    } else {
        res.status(400).json({ message: "Invalid type specified" });
    }
});

module.exports = router;