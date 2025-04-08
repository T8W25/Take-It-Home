// controllers/chat.controller.js
const Message = require("../models/Message.model");
exports.getConversations = async (req, res) => {
    try {
      const { userId } = req.params;
      const messages = await Message.find({
        $or: [{ senderId: userId }, { receiverId: userId }]
      })
        .populate("senderId", "username") // Include sender username
        .populate("receiverId", "username"); // Include receiver username
  
      const conversations = messages.reduce((acc, msg) => {
        const otherUser = msg.senderId._id === userId ? msg.receiverId : msg.senderId;
        const key = `${msg.itemId}-${otherUser._id}`;
        
        if (!acc[key]) {
          acc[key] = {
            itemId: msg.itemId,
            userId: otherUser._id,
            username: otherUser.username, // Add username
            lastMessage: msg.content,
            timestamp: msg.createdAt
          };
        }
        return acc;
      }, {});
  
      res.json(Object.values(conversations));
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  };
  
  exports.getChatHistory = async (req, res) => {
    try {
      const { itemId, user1, user2 } = req.params;
      const messages = await Message.find({
        itemId,
        $or: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 }
        ]
      })
        .sort("createdAt")
        .populate("senderId", "username") // Populate sender username
        .populate("receiverId", "username"); // Populate receiver username
  
      res.json(messages);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  };

  // ✅ NEW: persist an incoming message
exports.createMessage = async (data) => {
  const { senderId, receiverId, content, itemId, itemType } = data;
  const newMessage = new Message({
    senderId: data.senderId,
    receiverId: data.receiverId,
    content: data.content,
    itemId: data.itemId,
    itemModel: data.itemModel,
    createdAt: new Date()
  });
  return await newMessage.save();
};

  