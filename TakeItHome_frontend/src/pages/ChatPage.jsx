// import React, { useEffect, useState } from 'react';
// import { Container, Row, Col, Form, Button } from 'react-bootstrap';
// import io from 'socket.io-client';
// import { useLocation } from 'react-router-dom';

// const socket = io("https://take-it-home-8ldm.onrender.com"); // Match backend port

// const ChatPage = () => {
//   const location = useLocation();
//   const passedState = location.state;

//   const user = JSON.parse(localStorage.getItem("user"));
//   const loggedInUserId = user?._id;

//   const [message, setMessage] = useState('');
//   const [chatLog, setChatLog] = useState([]);
//   const [conversations, setConversations] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [listing, setListing] = useState(null);

//   const API_BASE = "https://take-it-home-8ldm.onrender.com";

//   // Load conversations on mount
//   useEffect(() => {
//     const fetchConversations = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/chat/conversations/${loggedInUserId}`);
//         const data = await res.json();
//         setConversations(data);

//         // Auto-select conversation if redirected from Notification
//         if (passedState?.itemId && passedState?.receiverId) {
//           const selected = {
//             itemId: passedState.itemId,
//             userId: passedState.receiverId
//           };
//           handleSelectChat(selected);
//         }
//       } catch (err) {
//         console.error("Error loading conversations:", err);
//       }
//     };

//     fetchConversations();
//   }, [loggedInUserId, passedState]);

//   // Listen for incoming socket messages
//   useEffect(() => {
//     socket.on('receive_message', (data) => {
//       if (
//         selectedChat &&
//         data.senderId &&
//         (data.senderId === selectedChat.userId || data.receiverId === selectedChat.userId)
//       ) {
//         setChatLog((prev) => [...prev, data]);
//       }
//     });

//     return () => {
//       socket.off('receive_message');
//     };
//   }, [selectedChat]);

//   const handleSelectChat = async (conv) => {
//     setSelectedChat(conv);
//     setChatLog([]);

//     try {
//       // Fetch chat history
//       const res = await fetch(`${API_BASE}/api/chat/history/${conv.itemId}/${loggedInUserId}/${conv.userId}`);
//       const data = await res.json();
//       setChatLog(data);

//       // Fetch item listing info
//       const listingRes = await fetch(`${API_BASE}/api/donation-items/${conv.itemId}`);
//       const listingData = await listingRes.json();
//       setListing(listingData);
//     } catch (err) {
//       console.error("Error loading chat or listing:", err);
//     }
//   };

//   const handleSend = (e) => {
//     e.preventDefault();
//     if (!message.trim() || !selectedChat) return;

//     const newMessage = {
//       senderId: loggedInUserId,
//       receiverId: selectedChat.userId,
//       content: message,
//       itemId: selectedChat.itemId,
//       createdAt: new Date().toISOString()
//     };

//     socket.emit("send_message", newMessage);
//     setChatLog((prev) => [...prev, newMessage]);
//     setMessage('');
//   };

//   return (
//     <Container fluid className="mt-4">
//       <Row>
//         {/* Left Sidebar: Conversations */}
//         <Col md={3} style={{ borderRight: '1px solid #ddd', height: '80vh', overflowY: 'auto' }}>
//           <h5>Messages</h5>
//           {conversations.map((conv, index) => (
//             <div
//               key={index}
//               onClick={() => handleSelectChat(conv)}
//               style={{
//                 padding: '10px',
//                 backgroundColor:
//                   selectedChat?.userId === conv.userId && selectedChat?.itemId === conv.itemId
//                     ? '#f0f0f0'
//                     : 'transparent',
//                 cursor: 'pointer'
//               }}
//             >
//               <div><strong>With:</strong> {conv.userId}</div>
//               <div style={{ fontSize: '0.8em', color: '#888' }}>{conv.lastMessage}</div>
//             </div>
//           ))}
//         </Col>

//         {/* Center: Chat Panel */}
//         <Col md={6}>
//           {selectedChat ? (
//             <>
//               <h5 className="mb-3">Chat with {selectedChat.userId}</h5>
//               <div style={{ height: '60vh', overflowY: 'scroll', border: '1px solid #ccc', padding: 10 }}>
//                 {chatLog.map((msg, i) => (
//                   <div key={i} style={{ marginBottom: '10px' }}>
//                     <strong>{msg.senderId === loggedInUserId ? 'You' : msg.senderId}</strong>: {msg.content}
//                     <div style={{ fontSize: '0.8em', color: '#999' }}>
//                       {new Date(msg.createdAt).toLocaleString()}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <Form onSubmit={handleSend} className="mt-3">
//                 <Form.Control
//                   type="text"
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   placeholder="Type a message..."
//                 />
//                 <Button type="submit" className="mt-2">Send</Button>
//               </Form>
//             </>
//           ) : (
//             <p className="text-muted mt-5">Select a conversation to begin</p>
//           )}
//         </Col>

//         {/* Right Sidebar: Listing Info */}
//         <Col md={3} style={{ borderLeft: '1px solid #ddd' }}>
//           <h5>Listing Info</h5>
//           {listing ? (
//             <div className="mt-3">
//               <img
//                 src={`https://take-it-home-8ldm.onrender.com${listing.imageUrl}`}
//                 alt="Item"
//                 style={{ width: '100%', borderRadius: '5px', marginBottom: '10px' }}
//               />
//               <div><strong>Title:</strong> {listing.title}</div>
//               <div><strong>Category:</strong> {listing.category}</div>
//               <div><strong>Condition:</strong> {listing.condition}</div>
//               <div><strong>Location:</strong> {listing.location}</div>
//             </div>
//           ) : (
//             <p className="text-muted">No item selected</p>
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default ChatPage;

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const socket = io(API_BASE); // Use environment variable

const ChatPage = () => {
  const location = useLocation();
  const { itemId, receiverId } = location.state || {};
  const [chatLog, setChatLog] = useState([]);
  const [message, setMessage] = useState("");


// Fetch chat history
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
      console.error("Failed to fetch chat history:", err);
    }
  };
  fetchChatHistory();
}, [selectedChat]);
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      senderId: localStorage.getItem("userId"),
      receiverId,
      content: message,
      itemId,
    };

    try {
      socket.emit("send_message", newMessage);
      setChatLog([...chatLog, newMessage]);
      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={8}>
          <div style={{ height: "60vh", overflowY: "auto", border: "1px solid #ccc" }}>
            {chatLog.map((msg, index) => (
              <div key={index} className="mb-2">
                <strong>{msg.senderId === localStorage.getItem("userId") ? "You" : "Them"}:</strong> {msg.content}
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

        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;
