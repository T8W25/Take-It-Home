const express = require("express");
const { signup } = require("../controllers/auth.controller");

const router = express.Router();

// Signup Route
router.post("/signup", signup);

module.exports = router;
