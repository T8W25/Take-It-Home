
// ChatPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://take-it-home-8ldm.onrender.com";
const socket = io(API_BASE);

const ChatPage = () => {
  const location = useLocation();
  const { itemId, receiverId } = location.state || {};
  const [chatLog, setChatLog] = useState([]);
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const loggedInUserId = user?._id;

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/chat/conversations/${loggedInUserId}`);
        const data = await res.json();
        setConversations(data);

        // Auto-select chat if parameters exist
        if (itemId && receiverId) {
          const selected = data.find(
            conv => conv.itemId === itemId && conv.userId === receiverId
          );
          if (selected) setSelectedChat(selected);
        }
      } catch (err) {
        setError("Failed to load conversations");
        console.error(err);
      }
    };
    fetchConversations();
  }, [loggedInUserId, itemId, receiverId]);

  // Fetch chat history when selectedChat changes
  useEffect(() => {
    if (!selectedChat) return;

    const fetchChatHistory = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/chat/history/${selectedChat.itemId}/${loggedInUserId}/${selectedChat.userId}`
        );
        const data = await res.json();
        setChatLog(data);
      } catch (err) {
        setError("Failed to load chat history");
        console.error(err);
      }
    };
    fetchChatHistory();
  }, [selectedChat]);

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receive_message", (newMessage) => {
      if (
        selectedChat &&
        newMessage.itemId === selectedChat.itemId &&
        (newMessage.senderId === selectedChat.userId || newMessage.receiverId === selectedChat.userId)
      ) {
        setChatLog(prev => [...prev, newMessage]);
      }
    });
    return () => socket.off("receive_message");
  }, [selectedChat]);

  const handleSelectChat = (conv) => {
    setSelectedChat(conv);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      senderId: loggedInUserId,
      receiverId: selectedChat.userId,
      content: message,
      itemId: selectedChat.itemId,
      createdAt: new Date().toISOString()
    };

    socket.emit("send_message", newMessage);
    setChatLog(prev => [...prev, newMessage]); // Update state immediately
    setMessage("");
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Left Sidebar: Conversations */}
        <Col md={3} style={{ borderRight: '1px solid #ddd', height: '80vh', overflowY: 'auto' }}>
          <h5>Chats</h5>
          {conversations.length === 0 ? (
            <Alert variant="info">No conversations yet</Alert>
          ) : (
            conversations.map((conv, index) => (
              <div
                key={index}
                onClick={() => handleSelectChat(conv)}
                style={{
                  padding: '10px',
                  backgroundColor: selectedChat?.itemId === conv.itemId && selectedChat?.userId === conv.userId ? '#f0f0f0' : 'transparent',
                  cursor: 'pointer'
                }}
              >
                <div><strong>{conv.username}</strong></div>
                <div style={{ fontSize: '0.8em', color: '#888' }}>{conv.lastMessage}</div>
              </div>
            ))
          )}
        </Col>

        {/* Right Panel: Chat */}
        <Col md={9}>
          {error && <Alert variant="danger">{error}</Alert>}
          {selectedChat ? (
            <>
              <h5>Chat with {selectedChat.username}</h5>
              <div style={{ height: '60vh', overflowY: 'auto', border: '1px solid #ccc', padding: 10 }}>
                {chatLog.map((msg, i) => (
                  <div key={i} className="mb-2">
                    <strong>{msg.senderId.username}:</strong> {msg.content}
                    <small className="d-block text-muted">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </small>
                  </div>
                ))}
              </div>
              <Form onSubmit={handleSend} className="mt-3">
                <Form.Control
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <Button type="submit" variant="primary" className="mt-2">
                  Send
                </Button>
              </Form>
            </>
          ) : (
            <p className="text-center mt-5">Select a conversation to start chatting</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;
