const express = require("express");
const { signup, login, logout } = require("../controllers/auth.controller");  // Ensure controller is imported

const router = express.Router();

// Define Routes Correctly
router.post("/signup", signup);  //  Make sure signup function exists
router.post("/login", login);  //  Make sure login function exists
router.post("/logout", logout);  //  Make sure logout function exists

module.exports = router;
