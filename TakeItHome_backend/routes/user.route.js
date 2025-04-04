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

router.get(
  "/profile",
  verifyToken,
  userController.getUserProfile
);


module.exports = router;
