const express = require("express");
const router = express.Router();
const { createDonationRequest } = require("../controllers/donationRequest.controller");

router.post("/", createDonationRequest);
module.exports = router;
