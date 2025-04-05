const express = require('express');
const router = express.Router();
const Message = require('../models/Message.model');

// ✅ POST: Send a donation/trade item request message
router.post('/send', async (req, res) => {
  const { senderId, receiverId, itemId, content, itemType } = req.body;

  if (!senderId || !receiverId || !itemId || !content || !itemType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newMessage = new Message({
      senderId,
      receiverId,
      itemId,
      content,
      itemType,
      createdAt: new Date()
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ GET: Chat history for a listing between two users
router.get('/history/:itemId/:user1/:user2', async (req, res) => {
  const { itemId, user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      itemId,
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ]
    }).sort('createdAt');

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// ✅ GET: All conversations for a user (donation/trade)
router.get('/conversations/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    });

    const uniqueConversations = {};

    messages.forEach(msg => {
      const otherUser = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const key = `${otherUser}-${msg.itemId}`;

      if (!uniqueConversations[key]) {
        uniqueConversations[key] = {
          userId: otherUser,
          itemId: msg.itemId,
          lastMessage: msg.content,
          itemType: msg.itemType,
          timestamp: msg.createdAt
        };
      }
    });

    res.json(Object.values(uniqueConversations));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
});

module.exports = router;
