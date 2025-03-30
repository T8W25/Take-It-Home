const User = require("../models/User.model");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage || null,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(userId, { profileImage: imageUrl });

    res.status(200).json({ message: "Profile photo updated", profileImage: imageUrl });
  } catch (err) {
    console.error("Upload Profile Photo Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ DO NOT USE `exports = {}` ❌
module.exports = {
  getUserProfile,
  uploadProfilePhoto,
};
