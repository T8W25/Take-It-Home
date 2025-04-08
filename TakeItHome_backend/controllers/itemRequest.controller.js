// // controllers/itemRequest.controller.js

// const ItemRequest = require("../models/ItemRequest.model");
// const Message = require("../models/Message.model");

// // ✅ CREATE a new request
// const createRequest = async (req, res) => {
//   try {
//     const { receiverId, itemId, message, itemType } = req.body;
//     const senderId = req.user.id;

//     if (!["donation", "trade"].includes(itemType)) {
//       return res.status(400).json({ message: "Invalid item type" });
//     }

//     const newRequest = new ItemRequest({
//       senderId,
//       receiverId,
//       itemId,
//       itemType,
//       message
//     });

//     await newRequest.save();

//     res.status(201).json({ message: "Request created", request: newRequest });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // ✅ GET received requests
// const getReceivedRequests = async (req, res) => {
//   try {
//     const requests = await ItemRequest.find({ receiverId: req.user.id })
//       .populate("itemId")
//       .populate("senderId", "username");
//     res.status(200).json(requests);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // ✅ GET sent requests
// const getSentRequests = async (req, res) => {
//   try {
//     const requests = await ItemRequest.find({ senderId: req.user.id })
//       .populate("itemId")
//       .populate("receiverId", "username");
//     res.status(200).json(requests);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };


// // const acceptRequest = async (req, res) => {
// //   try {
// //     const request = await ItemRequest.findById(req.params.id);
// //     if (!request) return res.status(404).json({ message: "Request not found" });

// //     // Existing authorization checks...

// //     request.status = "accepted";
// //     await request.save();

// //     // Create initial chat message
// //     const messageContent = "Your request has been accepted. Let's chat!";
// //     const newMessage = new Message({
// //       senderId: request.receiverId, // Trader/Donor who accepted
// //       receiverId: request.senderId, // User who made the request
// //       itemId: request.itemId,
// //       content: messageContent,
// //       itemType: request.itemType,
// //       itemModel: request.itemType === "donation" ? "DonationItem" : "TradeItem",
// //     });
// //     await newMessage.save();

// //     res.status(200).json({ message: "Request accepted", request });
// //   } catch (err) {
// //     // Error handling...
// //   }
// // };

// // Add this to the acceptRequest function:
// const acceptRequest = async (req, res) => {
//   try {
//     const request = await ItemRequest.findById(req.params.id)
//       .populate("itemId") // Ensure item details are available
//       .populate("senderId", "username"); // Populate sender details
    
//     // ... existing checks ...

//     request.status = "accepted";
//     await request.save();

//     // Create initial message
//     const newMessage = new Message({
//       senderId: request.receiverId, // Trader/donor
//       receiverId: request.senderId, // Requester
//       content: "Your request has been accepted. Let's chat!",
//       itemId: request.itemId,
//       itemModel: request.itemType === "donation" ? "DonationItem" : "TradeItem",
//     });
//     await newMessage.save();

//     // Emit to both users
//     io.to(request.senderId._id.toString()).emit("receive_message", newMessage);
//     io.to(request.receiverId.toString()).emit("receive_message", newMessage);

//     res.status(200).json({ 
//       message: "Request accepted", 
//       request: request,
//       conversation: {
//         itemId: request.itemId,
//         userId: request.senderId._id,
//         username: request.senderId.username,
//         itemType: request.itemType,
//         senderId: request.senderId._id
//       }
//     });
//   } catch (err) {
//     console.error("Error accepting request:", err.message);
//     res.status(500).json({ message: "Failed to accept request" });
//   }
// };

// // ✅ DECLINE request
// const declineRequest = async (req, res) => {
//   try {
//     const request = await ItemRequest.findById(req.params.id);
//     if (!request) return res.status(404).json({ message: "Request not found" });

//     if (request.receiverId.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     request.status = "declined";
//     await request.save();
//     res.status(200).json({ message: "Request declined", request });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // ✅ CANCEL request
// const cancelRequest = async (req, res) => {
//   try {
//     const request = await ItemRequest.findById(req.params.id);
//     if (!request) return res.status(404).json({ message: "Request not found" });

//     if (request.senderId.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     if (request.status !== "pending") {
//       return res.status(400).json({ message: "Only pending requests can be cancelled" });
//     }

//     await request.deleteOne();
//     res.status(200).json({ message: "Request cancelled" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // ✅ EXPORT all functions
// module.exports = {
//   createRequest,
//   getReceivedRequests,
//   getSentRequests,
//   acceptRequest,
//   declineRequest,
//   cancelRequest
// };


const ItemRequest = require("../models/ItemRequest.model");
const Message = require("../models/Message.model");

// ✅ CREATE a new request
const createRequest = async (req, res) => {
  try {
    const { receiverId, itemId, message, itemType } = req.body;
    const senderId = req.user.id;

    if (!["donation", "trade"].includes(itemType)) {
      return res.status(400).json({ message: "Invalid item type" });
    }

    const newRequest = new ItemRequest({
      senderId,
      receiverId,
      itemId,
      itemType,
      message
    });

    await newRequest.save();

    res.status(201).json({ message: "Request created", request: newRequest });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ GET received requests
const getReceivedRequests = async (req, res) => {
  try {
    const requests = await ItemRequest.find({ receiverId: req.user.id })
      .populate("itemId")
      .populate("senderId", "username");
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ GET sent requests
const getSentRequests = async (req, res) => {
  try {
    const requests = await ItemRequest.find({ senderId: req.user.id })
      .populate("itemId")
      .populate("receiverId", "username");
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ ACCEPT request
const acceptRequest = async (req, res) => {
  try {
    const request = await ItemRequest.findById(req.params.id)
      .populate("itemId") // Populate item details
      .populate("senderId", "username"); // Populate sender details

    if (!request) return res.status(404).json({ message: "Request not found" });

    // (Perform any additional authorization checks here)

    request.status = "accepted";
    await request.save();

    // Create an initial chat message to confirm acceptance
    const newMessage = new Message({
      senderId: request.receiverId, // The trader/donor who accepted the request
      receiverId: request.senderId, // The user who made the request
      content: "Your request has been accepted. Let's chat!",
      itemId: request.itemId,
      itemModel: request.itemType === "donation" ? "DonationItem" : "TradeItem",
      createdAt: new Date()
    });
    await newMessage.save();

    // Remove the socket.io emits from here. They caused issues because "io" is not defined.
    // Instead, simply return the conversation data.
    res.status(200).json({ 
      message: "Request accepted", 
      request: request,
      conversation: {
        itemId: request.itemId,
        userId: request.senderId._id,
        username: request.senderId.username,
        itemType: request.itemType
      }
    });
  } catch (err) {
    console.error("Error accepting request:", err.message);
    res.status(500).json({ message: "Failed to accept request" });
  }
};

// ✅ DECLINE request
const declineRequest = async (req, res) => {
  try {
    const request = await ItemRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.receiverId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "declined";
    await request.save();
    res.status(200).json({ message: "Request declined", request });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ CANCEL request
const cancelRequest = async (req, res) => {
  try {
    const request = await ItemRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.senderId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Only pending requests can be cancelled" });
    }

    await request.deleteOne();
    res.status(200).json({ message: "Request cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createRequest,
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  declineRequest,
  cancelRequest
};

