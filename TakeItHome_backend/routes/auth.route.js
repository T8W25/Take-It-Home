const express = require("express");
const { signup, login, logout } = require("../controllers/auth.controller");
const { forgotPassword, resetPassword } = require('../controllers/auth.controller');
const router = express.Router();

// Signup Route
router.post("/signup", signup);

// Login Route
router.post("/login", login);

router.post("/logout", logout);

router.post('/forgot-password', forgotPassword);

// Reset Password Route (GET for rendering the reset page)
router.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    res.send(`
      <form action="/api/auth/reset-password/${token}" method="POST">
        <input type="password" name="newPassword" placeholder="Enter your new password" required />
        <button type="submit">Reset Password</button>
      </form>
    `);
  });

// Reset Password Route
router.post('/reset-password/:token', resetPassword);

module.exports = router;
