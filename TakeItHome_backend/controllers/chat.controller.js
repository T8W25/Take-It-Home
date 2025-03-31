const Message = require("../models/Message.model");

// ✅ Get chat history for an item between two users
exports.getChatHistory = async (req, res) => {
  try {
    const { itemId, user1, user2 } = req.params;
    const messages = await Message.find({
      itemId,
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ]
    }).sort("createdAt");
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chat history", error: err.message });
  }
};

// ✅ Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    });
    
    // Group messages by itemId and other user
    const conversations = messages.reduce((acc, msg) => {
      const otherUser = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const key = `${msg.itemId}-${otherUser}`;
      
      if (!acc[key]) {
        acc[key] = {
          itemId: msg.itemId,
          userId: otherUser,
          lastMessage: msg.content,
          timestamp: msg.createdAt
        };
      }
      return acc;
    }, {});
    
    res.status(200).json(Object.values(conversations));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch conversations", error: err.message });
  }
};

// ✅ Create a new message (called via Socket.IO)
exports.createMessage = async (data) => {
  try {
    const newMessage = new Message(data);
    await newMessage.save();
    return newMessage;
  } catch (err) {
    console.error("Message save error:", err.message);
    throw err;
  }
};