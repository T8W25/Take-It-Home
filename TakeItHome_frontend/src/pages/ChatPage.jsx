// ✅ FINAL FIXED ChatPage.jsx with full working message system
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import "./ChatPage.css"; // ✅ Custom styles

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3002";
const socket = io(API_BASE, {
  withCredentials: true,
  transports: ["websocket"],
  auth: { token: localStorage.getItem("jwtToken") },
});

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemId, receiverId } = location.state || {};

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const loggedInUserId = user._id || user.id;

  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [listing, setListing] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (!token || !loggedInUserId) navigate("/login");
  }, [token, loggedInUserId, navigate]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/chat/conversations/${loggedInUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setConversations(data);
        if (itemId && receiverId) {
          const found = data.find(
            (c) =>
              c.itemId?._id?.toString() === itemId.toString() &&
              c.userId?.toString() === receiverId.toString()
          );
          if (found) {
            setSelectedChat({
              itemId: found.itemId._id,
              userId: found.userId,
              username: found.username,
              itemType: found.itemType,
            });
          }
        }
      } catch (err) {
        console.error("Fetch conversations failed:", err);
      }
    };
    fetchConversations();
  }, [itemId, receiverId, loggedInUserId, token]);

  useEffect(() => {
    const fetchChatDetails = async () => {
      try {
        const { itemId, userId, itemType } = selectedChat;
        const history = await fetch(`${API_BASE}/api/chat/history/${itemId}/${loggedInUserId}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatLog(await history.json());

        const endpoint = itemType === "trade" ? "trade-items" : "donation-items";
        const itemData = await (await fetch(`${API_BASE}/api/${endpoint}/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })).json();
        setListing(itemData);

        const userData = await (await fetch(`${API_BASE}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })).json();
        setOtherUser(userData);
      } catch (err) {
        console.error("Chat data failed:", err);
      }
    };

    if (selectedChat) fetchChatDetails();
  }, [selectedChat, token, loggedInUserId]);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      if (
        selectedChat &&
        msg.itemId === selectedChat.itemId &&
        (msg.senderId === selectedChat.userId || msg.receiverId === selectedChat.userId)
      ) {
        setChatLog((prev) => [...prev, msg]);
      }
    });
    return () => socket.off("receive_message");
  }, [selectedChat]);

  useEffect(() => {
    if (loggedInUserId) socket.emit("join", loggedInUserId.toString());
  }, [loggedInUserId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;
  
    const msgPayload = {
      receiverId: selectedChat.userId,
      itemId: selectedChat.itemId,
      content: message,
      itemType: selectedChat.itemType,
    };
  
    try {
      const response = await fetch(`${API_BASE}/api/chat/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(msgPayload),
      });
  
      const savedMessage = await response.json();
  
      if (savedMessage && savedMessage._id && savedMessage.createdAt) {
        socket.emit("send_message", savedMessage);
        setChatLog((prev) => [...prev, savedMessage]);
        setMessage("");
      } else {
        console.error("❌ Message not saved properly:", savedMessage);
      }
    } catch (err) {
      console.error("❌ Message send failed:", err);
    }
  };
  
  return (
    <Container fluid className="chat-container">
      <Row>
        <Col md={3} className="chat-sidebar">
          <h5>Messages</h5>
          {conversations.map((conv, idx) => (
            <div
              key={idx}
              onClick={() =>
                setSelectedChat({
                  itemId: conv.itemId._id,
                  userId: conv.userId,
                  username: conv.username,
                  itemType: conv.itemType,
                })
              }
              className={`chat-conv ${selectedChat?.itemId === conv.itemId._id ? "active" : ""}`}
            >
              <strong>With:</strong> {conv.username}
              <div className="last-message">{conv.lastMessage}</div>
            </div>
          ))}
        </Col>

        <Col md={6} className="chat-panel">
          {selectedChat ? (
            <>
              <h5>Chat with {selectedChat.username}</h5>
              <div className="chat-history">
                {chatLog.map((msg, i) => (
                  <div key={i} className={`chat-msg ${msg.senderId === loggedInUserId ? "me" : "them"}`}>
                    <strong>{msg.senderId === loggedInUserId ? "You" : selectedChat.username}</strong>: {msg.content}
                    <div className="chat-time">
                      {msg.createdAt && !isNaN(new Date(msg.createdAt))
                        ? new Date(msg.createdAt).toLocaleString()
                        : "Unknown time"}
                    </div>
                  </div>
                ))}
              </div>
              <Form onSubmit={handleSend} className="chat-form">
                <Form.Control
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <Button type="submit" disabled={!message.trim()}>
                  Send
                </Button>
              </Form>
            </>
          ) : (
            <p className="text-muted">Select a conversation to begin</p>
          )}
        </Col>

        <Col md={3} className="chat-details">
          <h5>Listing Info</h5>
          {listing ? (
            <div>
              {listing.imageBase64 ? (
                <img src={listing.imageBase64} alt="Item" className="chat-image" />
              ) : (
                <p>No image</p>
              )}
              <div><strong>Title:</strong> {listing.title}</div>
              <div><strong>Category:</strong> {listing.category}</div>
              <div><strong>Condition:</strong> {listing.condition}</div>
              <div><strong>Location:</strong> {listing.location}</div>
            </div>
          ) : (
            <p className="text-muted">No item selected</p>
          )}
          <h5 className="mt-4">User Profile</h5>
          {otherUser && (
            <div>
              <img
                src={
                  otherUser.profileImage?.startsWith("data")
                    ? otherUser.profileImage
                    : `${API_BASE}${otherUser.profileImage || "/default-profile.png"}`
                }
                alt="Profile"
                className="profile-pic"
              />
              <div><strong>Name:</strong> {otherUser.name}</div>
              <div><strong>Email:</strong> {otherUser.email}</div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;
