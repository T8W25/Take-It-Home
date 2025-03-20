const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, unique: true, sparse: true }, // ✅ Add sparse to prevent null duplicates
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
