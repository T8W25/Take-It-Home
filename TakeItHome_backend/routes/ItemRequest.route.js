const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authmiddleware");
const {
  createRequest,
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  declineRequest,
  cancelRequest
} = require("../controllers/itemRequest.controller");

router.post("/", verifyToken, createRequest);
router.get("/received", verifyToken, getReceivedRequests);
router.get("/sent", verifyToken, getSentRequests);
router.put("/:id/accept", verifyToken, acceptRequest);
router.put("/:id/decline", verifyToken, declineRequest);
router.delete("/:id/cancel", verifyToken, cancelRequest);

module.exports = router;
