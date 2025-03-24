const ItemRequest = require("../models/ItemRequest.model");

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
    const request = await ItemRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.receiverId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "accepted";
    await request.save();
    res.status(200).json({ message: "Request accepted", request });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
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

// ✅ EXPORT all functions
module.exports = {
  createRequest,
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  declineRequest,
  cancelRequest
};
