//routes/user.route.js

const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { verifyToken } = require("../middleware/authmiddleware"); // ✅ FIXED
const userController = require("../controllers/user.controller");

router.post(
  "/upload-profile",
  verifyToken,
  upload.single("profileImage"),
  userController.uploadProfilePhoto
);

// router.get(
//   "/profile",
//   verifyToken,
//   userController.getUserProfile
// );

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

module.exports = router;
