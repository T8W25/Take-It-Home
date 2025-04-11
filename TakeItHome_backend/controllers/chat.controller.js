// controllers/chat.controller.js
const Message = require("../models/Message.model");
exports.getConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
    .populate("senderId", "username")
    .populate("receiverId", "username")
    .populate("itemId")
    .sort({ createdAt: -1 });

    const conversations = messages.reduce((acc, msg) => {
      const otherUser = (msg.senderId._id.toString() === userId)
        ? msg.receiverId
        : msg.senderId;

      const key = `${msg.itemId._id}-${otherUser._id}`;

      if (!acc[key]) {
        acc[key] = {
          itemId: msg.itemId._id,
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
    console.error("Error fetching conversations:", err);
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
// ✅ Ensure this is already in your chat.controller.js

exports.createMessage = async (data) => {
  console.log("🔥 Incoming Message Data:", data); // Add this line

  const newMessage = new Message({
    senderId: data.senderId,
    receiverId: data.receiverId,
    content: data.content,
    itemId: data.itemId,
    itemModel: data.itemModel,
    createdAt: new Date(),
  });

  const saved = await newMessage.save();
  console.log("✅ Message saved to DB:", saved); // And this line
  return saved;
};




  