const express = require('express');
const router = express.Router();
const Message = require('../models/Message.model');
const { verifyToken } = require('../middleware/authmiddleware');

// ✅ POST: Send a message (called from frontend)
router.post('/send', verifyToken, async (req, res) => {
  const { receiverId, itemId, content, itemType } = req.body;
  const senderId = req.user.id;

  if (!senderId || !receiverId || !itemId || !content || !itemType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newMessage = new Message({
      senderId,
      receiverId,
      itemId,
      content,
      itemModel: itemType === "trade" ? "TradeItem" : "DonationItem",
      createdAt: new Date()  // ensure timestamp
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ GET: Chat history for specific item between two users
router.get("/history/:itemId/:senderId/:receiverId", verifyToken, async (req, res) => {
  try {
    const { itemId, senderId, receiverId } = req.params;

    const messages = await Message.find({
      itemId,
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort("createdAt");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// ✅ GET: All conversations for the current user
router.get("/conversations/:userId", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.params.userId },
        { receiverId: req.params.userId }
      ]
    })
      .populate("senderId", "username")
      .populate("receiverId", "username")
      .populate("itemId")
      .sort({ createdAt: -1 });

    const conversations = messages.reduce((acc, msg) => {
      const userIdStr = req.params.userId.toString();
      const senderIdStr = msg.senderId._id.toString();
      const receiverIdStr = msg.receiverId._id.toString();

      const otherUser = senderIdStr === userIdStr ? msg.receiverId : msg.senderId;

      const key = `${otherUser._id.toString()}-${msg.itemId._id ? msg.itemId._id.toString() : msg.itemId.toString()}`;

      if (!acc[key]) {
        acc[key] = {
          itemId: msg.itemId,
          userId: otherUser._id,
          username: otherUser.username,
          lastMessage: msg.content,
          timestamp: msg.createdAt,
          itemType: msg.itemModel === "DonationItem" ? "donation" : "trade"
        };
      }
      return acc;
    }, {});

    res.json(Object.values(conversations));
  } catch (err) {
    res.status(500).json({ message: "Error fetching conversations" });
  }
});

module.exports = router;
