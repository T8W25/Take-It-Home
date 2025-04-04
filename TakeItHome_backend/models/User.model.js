const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String }, // ✅ added for profile photo
  resetPasswordToken: { type: String }, // ✅ Token for password reset
  resetPasswordExpires: { type: Date }, // ✅ Expiry for the reset token
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
