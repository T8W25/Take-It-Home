const express = require("express");
const { signup, login, logout } = require("../controllers/auth.controller");
const router = express.Router();

// Signup Route
router.post("/signup", signup);

// Login Route
router.post("/login", login);

router.post("/logout", logout);

module.exports = router;
