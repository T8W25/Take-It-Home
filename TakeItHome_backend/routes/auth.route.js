/*
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

*/

const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { signup, login, logout } = require("../controllers/auth.controller");
const sendEmail = require("../utils/sendEmail"); // Utility to send emails
const User = require("../models/User.model"); // Corrected import for the User model
const router = express.Router();

// Signup Route
router.post("/signup", signup);

// Login Route
router.post("/login", login);

// Logout Route
router.post("/logout", logout);

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  try {
    console.log("👉 Forgot Password Request Body:", req.body);

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes
    await user.save();

    // Send the reset email
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const message = `You requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("❌ Forgot Password Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    // Hash the token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("👉 Raw Token:", token);
    console.log("👉 Hashed Token:", hashedToken);

    // Find the user
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Corrected field name
    });

    console.log("👉 User Found:", user);

    if (!user) {
      console.error("❌ User not found or token expired");
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear the reset token and expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Reset Password Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;


