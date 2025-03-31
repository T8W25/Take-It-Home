const express = require('express');
const router = express.Router();
const Message = require('../models/Message.model');
const {getChatHistory, getConversations} = require('../controllers/chat.controller');

// ✅ Get chat history for a listing between two users
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

// ✅ Get all conversations for a user
router.get('/conversations/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    });

    // Group by userId + itemId combo
    const uniqueConversations = {};

    messages.forEach(msg => {
      const otherUser = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const key = `${otherUser}-${msg.itemId}`;

      if (!uniqueConversations[key]) {
        uniqueConversations[key] = {
          userId: otherUser,
          itemId: msg.itemId,
          lastMessage: msg.content,
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
