// //routes/chat.route.js

// const express = require('express');
// const router = express.Router();
// const Message = require('../models/Message.model');
// const { verify } = require('jsonwebtoken');
// const { verifyToken } = require('../middleware/authmiddleware');
// // ✅ POST: Send a donation/trade item request message
// router.post('/send', async (req, res) => {
//   const { senderId, receiverId, itemId, content, itemType } = req.body;

//   if (!senderId || !receiverId || !itemId || !content || !itemType) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       itemId,
//       content,
//       itemType,
//       createdAt: new Date()
//     });

//     const savedMessage = await newMessage.save();
//     res.status(201).json(savedMessage);
//   } catch (error) {
//     console.error("Error saving message:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // ✅ GET: Chat history for a listing between two users
// // router.get('/history/:itemId/:user1/:user2', async (req, res) => {
// //   const { itemId, user1, user2 } = req.params;

// //   try {
// //     const messages = await Message.find({
// //       itemId,
// //       $or: [
// //         { senderId: user1, receiverId: user2 },
// //         { senderId: user2, receiverId: user1 }
// //       ]
// //     }).sort('createdAt');

// //     res.json(messages);
// //   } catch (err) {
// //     res.status(500).json({ message: 'Failed to fetch messages' });
// //   }
// // });

// // Add GET /messages route
// router.get("/messages", async (req, res) => {
//   try {
//     const { itemId, senderId, receiverId } = req.query;
//     const messages = await Message.find({
//       itemId,
//       $or: [
//         { senderId: senderId, receiverId: receiverId },
//         { senderId: receiverId, receiverId: senderId },
//       ],
//     }).sort("createdAt");
//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching messages" });
//   }
// });

// router.get("/conversations/:userId", verifyToken, async (req, res) => {
//   try {
//     const messages = await Message.find({
//       $or: [
//         { senderId: req.params.userId },
//         { receiverId: req.params.userId }
//       ]
//     })
//     .populate("senderId", "username")
//     .populate("receiverId", "username")
//     .populate("itemId")
//     .sort({ createdAt: -1 });

//     const conversations = messages.reduce((acc, msg) => {
//       const otherUser = msg.senderId._id === req.params.userId 
//         ? msg.receiverId 
//         : msg.senderId;
        
//       const key = `${otherUser._id}-${msg.itemId}`;
//       if (!acc[key]) {
//         acc[key] = {
//           itemId: msg.itemId,
//           userId: otherUser._id,
//           username: otherUser.username,
//           lastMessage: msg.content,
//           timestamp: msg.createdAt,
//           itemType: msg.itemModel === "DonationItem" ? "donation" : "trade"
//         };
//       }
//       return acc;
//     }, {});

//     res.json(Object.values(conversations));
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching conversations" });
//   }
// });
// // GET /history/:itemId/:senderId/:receiverId
// router.get("/history/:itemId/:senderId/:receiverId", verifyToken, async (req, res) => {
//   try {
//     const { itemId, senderId, receiverId } = req.params;
//     const messages = await Message.find({
//       itemId,
//       $or: [
//         { senderId, receiverId },
//         { senderId: receiverId, receiverId: senderId },
//       ],
//     }).sort("createdAt");

//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching messages" });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Message = require('../models/Message.model');
const { verifyToken } = require('../middleware/authmiddleware');

// ✅ POST: Send a donation/trade item request message
router.post('/send', verifyToken, async (req, res) => {
  // Instead of relying on the client for senderId, we use req.user.id
  const { receiverId, itemId, content, itemType } = req.body;
  const senderId = req.user.id; // comes from verifyToken middleware

  if (!senderId || !receiverId || !itemId || !content || !itemType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Ensure we save itemModel based on itemType for later use
    const newMessage = new Message({
      senderId,
      receiverId,
      itemId,
      content,
      itemModel: itemType === "trade" ? "TradeItem" : "DonationItem",
      createdAt: new Date()
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ GET: Chat history using query parameters
router.get("/messages", async (req, res) => {
  try {
    const { itemId, senderId, receiverId } = req.query;
    const messages = await Message.find({
      itemId,
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort("createdAt");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// ✅ GET: Conversations for a user
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
      // Use toString for comparison:
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
          // Here, use the saved field (either itemType or itemModel) – here we use itemModel:
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

// ✅ GET: Chat history for a listing between two users
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

// GET accepted chat users for a specific user
router.get('/accepted-users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const acceptedUsers = await FriendRequest.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ],
      status: 'accepted'
    })
    .populate('senderId', 'name email')  // populate user fields
    .populate('receiverId', 'name email');

    const users = acceptedUsers.map((req) => {
      const isSender = req.senderId._id.toString() === userId;
      return isSender ? req.receiverId : req.senderId;
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = router;

