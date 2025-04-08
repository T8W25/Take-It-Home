import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";

const socket = io("http://localhost:3002", {
  withCredentials: true,
  transports: ['websocket'],
  auth: {
    token: localStorage.getItem("jwtToken")
  }
});

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemId, receiverId, itemType, username } = location.state || {};
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const loggedInUserId = user._id || user.id; // Updated to check both _id and id

  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(
    itemId && receiverId
      ? { itemId, userId: receiverId, itemType, username }
      : null
  );
  const [listing, setListing] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3002";
  const token = localStorage.getItem("jwtToken");

  // Log token and user for debugging
  console.log("Token:", token);
  console.log("User:", user);

  // Redirect if not authenticated
  useEffect(() => {
    if (!token || !loggedInUserId) {
      navigate("/login");
    }
  }, [token, loggedInUserId, navigate]);

  // Load conversations
  useEffect(() => {
    if (!token) return;

    const loadConversations = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/chat/conversations/${loggedInUserId}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();
        setConversations(data);

        // Auto-select conversation if coming from notification
        if (itemId && receiverId) {
          const targetItemId = itemId.toString();
          const targetReceiverId = receiverId.toString();
          const found = data.find((conv) => 
            conv.itemId && conv.itemId._id &&
            conv.itemId._id.toString() === targetItemId &&
            ((conv.user1 && conv.user1._id.toString() === targetReceiverId) || 
            (conv.user2 && conv.user2._id.toString() === targetReceiverId))
          );
          if (found) {
            const otherUser = found.user1._id.toString() === loggedInUserId ? found.user2 : found.user1;
            setSelectedChat({
              itemId: found.itemId._id.toString(),
              userId: otherUser._id.toString(),
              username: otherUser.username,
              itemType: found.itemModel === "TradeItem" ? "trade" : "donation"
            });
          } else {
            setSelectedChat({ itemId, userId: receiverId, itemType, username });
          }
        }
      } catch (err) {
        console.error("Error loading conversations:", err);
        if (err.message.includes("401")) {
          navigate("/login");
        }
      }
    };

    loadConversations();
  }, [loggedInUserId, itemId, receiverId, token, navigate, itemType, username]);

  // Load chat history and listing details when a conversation is selected
  useEffect(() => {
    if (!selectedChat?.itemId || !token) return;

    const loadChatData = async () => {
      try {
        const historyRes = await fetch(
          `${API_BASE}/api/chat/history/${selectedChat.itemId}/${loggedInUserId}/${selectedChat.userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const historyData = await historyRes.json();
        setChatLog(historyData);

        const endpoint = selectedChat.itemType === "trade" 
          ? "api/trade-items" 
          : "api/donation-items";
        const itemRes = await fetch(
          `${API_BASE}/${endpoint}/${selectedChat.itemId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const itemData = await itemRes.json();
        setListing(itemData);

        const userRes = await fetch(
          `${API_BASE}/api/users/${selectedChat.userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const userData = await userRes.json();
        setOtherUser(userData);
      } catch (err) {
        console.error("Error loading chat data:", err);
        if (err.message.includes("401")) {
          navigate("/login");
        }
      }
    };

    loadChatData();
  }, [selectedChat, loggedInUserId, token, navigate]);

  useEffect(() => {
    const handleMessage = (newMessage) => {
      if (
        newMessage.itemId.toString() === selectedChat?.itemId.toString() &&
        (newMessage.senderId.toString() === selectedChat.userId.toString() ||
         newMessage.receiverId.toString() === selectedChat.userId.toString())
      ) {
        setChatLog(prev => [...prev, newMessage]);
      }
    };

    socket.on("receive_message", handleMessage);
    return () => socket.off("receive_message", handleMessage);
  }, [selectedChat]);

  useEffect(() => {
    if (loggedInUserId && token) {
      socket.emit("join", loggedInUserId.toString());
    }
  }, [loggedInUserId, token]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;
    const newMsg = {
      senderId: loggedInUserId,
      receiverId: selectedChat.userId,
      content: message,
      itemId: selectedChat.itemId,
      itemModel: selectedChat.itemType === "trade" ? "TradeItem" : "DonationItem"
    };
    socket.emit("send_message", newMsg);
    setChatLog(prev => [...prev, { ...newMsg, createdAt: new Date().toISOString() }]);
    setMessage("");
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Conversations List */}
        <Col md={3} style={{ borderRight: "1px solid #ddd", height: "80vh", overflowY: "auto" }}>
          <h5>Messages</h5>
          {conversations.length === 0 ? (
            <p>Select a conversation to begin</p>
          ) : (
            conversations.map((conv, i) => (
              <div
                key={i}
                onClick={() => setSelectedChat({
                  itemId: conv.itemId._id.toString(),
                  userId: conv.user1 && conv.user1._id.toString() === loggedInUserId ? conv.user2._id.toString() : conv.user1._id.toString(),
                  username: conv.user1 && conv.user1._id.toString() === loggedInUserId ? conv.user2.username : conv.user1.username,
                  itemType: conv.itemModel === "TradeItem" ? "trade" : "donation"
                })}
                style={{
                  padding: "10px",
                  backgroundColor:
                    selectedChat &&
                    conv.itemId &&
                    conv.itemId._id &&
                    conv.itemId._id.toString() === selectedChat.itemId &&
                    ((conv.user1 && conv.user1._id.toString() === selectedChat.userId) ||
                     (conv.user2 && conv.user2._id.toString() === selectedChat.userId))
                      ? "#f0f0f0"
                      : "transparent",
                  cursor: "pointer"
                }}
              >
                <div><strong>With:</strong> {conv.user1 && conv.user1._id.toString() === loggedInUserId ? conv.user2.username : conv.user1.username}</div>
                <div style={{ fontSize: "0.8em", color: "#888" }}>{conv.lastMessage}</div>
              </div>
            ))
          )}
        </Col>

        {/* Chat Panel */}
        <Col md={6}>
          {selectedChat ? (
            <>
              <h5 className="mb-3">Chat with {selectedChat.username}</h5>
              <div style={{ height: "60vh", overflowY: "auto", border: "1px solid #ccc", padding: 10 }}>
                {chatLog.length === 0 ? (
                  <p>No messages yet.</p>
                ) : (
                  chatLog.map((msg, i) => (
                    <div key={i} style={{ marginBottom: "10px" }}>
                      <strong>{msg.senderId.toString() === loggedInUserId ? "You" : selectedChat.username}</strong>: {msg.content}
                      <div style={{ fontSize: "0.8em", color: "#999" }}>
                        {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Form onSubmit={handleSend} className="mt-3">
                <Form.Control
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <Button type="submit" className="mt-2" disabled={!message.trim()}>
                  Send
                </Button>
              </Form>
            </>
          ) : (
            <p className="text-muted mt-5">Select a conversation to begin</p>
          )}
        </Col>

        {/* Listing & User Details */}
        <Col md={3} style={{ borderLeft: "1px solid #ddd" }}>
          <h5>Listing Info</h5>
          {listing ? (
            <div className="mt-3">
              {listing.imageUrl ? (
                <img
                  src={`${API_BASE}${listing.imageUrl}`}
                  alt={listing.title}
                  style={{ width: "100%", borderRadius: "5px", marginBottom: "10px" }}
                />
              ) : listing.imageBase64 ? (
                <img
                  src={listing.imageBase64}
                  alt={listing.title}
                  style={{ width: "100%", borderRadius: "5px", marginBottom: "10px" }}
                />
              ) : (
                <p>No image available</p>
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
          {otherUser ? (
            <div className="mt-3">
              <img 
                src={`${API_BASE}${otherUser.profileImage || '/default-profile.png'}`} 
                alt="Profile" 
                style={{ width: "100px", borderRadius: "50%", marginBottom: "10px" }} 
              />
              <div><strong>Name:</strong> {otherUser.name}</div>
              <div><strong>Email:</strong> {otherUser.email}</div>
            </div>
          ) : (
            <p className="text-muted">Loading user...</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;






// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import io from "socket.io-client";
// import { useLocation } from "react-router-dom";

// const socket = io("http://localhost:3002", {
//   withCredentials: true,
//   transports: ["websocket"],
// });

// const ChatPage = () => {
//   const location = useLocation();
//   const { itemId, receiverId, itemType } = location.state || {};
//   const user = JSON.parse(localStorage.getItem("user")) || {};
//   const [message, setMessage] = useState("");
//   const [chatLog, setChatLog] = useState([]);
//   const [conversations, setConversations] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [listing, setListing] = useState(null);
//   const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3002";

//   // Load conversations on mount
//   useEffect(() => {
//     if (!user._id) return;

//     const loadConversations = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/chat/conversations/${user._id}`);
//         const data = await res.json();
//         setConversations(data);

//         // Auto-select chat from notification
//         if (itemId && receiverId) {
//           const conv = data.find((c) =>
//             c.itemId === itemId && c.userId === receiverId
//           );
//           if (conv) setSelectedChat(conv);
//         }
//       } catch (err) {
//         console.error("Error loading conversations:", err);
//       }
//     };

//     loadConversations();
//   }, [user._id, itemId, receiverId]);

//   // Load chat history and item details when selectedChat changes
//   useEffect(() => {
//     if (!selectedChat?.itemId || !user._id) return;

//     const loadChatData = async () => {
//       try {
//         // Load chat history
//         const historyRes = await fetch(
//           `${API_BASE}/api/chat/history/${selectedChat.itemId}/${user._id}/${selectedChat.userId}`
//         );
//         const historyData = await historyRes.json();
//         setChatLog(historyData);

//         // Load item details
//         const itemRes = await fetch(
//           `${API_BASE}/${selectedChat.itemType === "trade" ? "api/trade-items" : "api/donation-items"}/${selectedChat.itemId}`
//         );
//         const itemData = await itemRes.json();
//         setListing(itemData);
//       } catch (err) {
//         console.error("Error loading chat data:", err);
//       }
//     };

//     loadChatData();
//   }, [selectedChat, user._id]);

//   // Socket listeners
//   useEffect(() => {
//     const handleMessage = (newMessage) => {
//       if (
//         newMessage.itemId === selectedChat?.itemId &&
//         (newMessage.senderId === selectedChat.userId ||
//           newMessage.receiverId === selectedChat.userId)
//       ) {
//         setChatLog((prev) => [...prev, newMessage]);
//       }
//     };

//     socket.on("receive_message", handleMessage);
//     return () => socket.off("receive_message");
//   }, [selectedChat]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!message.trim() || !selectedChat) return;

//     const newMessage = {
//       senderId: user._id,
//       receiverId: selectedChat.userId,
//       content: message,
//       itemId: selectedChat.itemId,
//       itemModel: selectedChat.itemType === "trade" ? "TradeItem" : "DonationItem",
//       createdAt: new Date().toISOString(),
//     };

//     try {
//       socket.emit("send_message", newMessage);
//       setChatLog((prev) => [...prev, newMessage]);
//       setMessage("");
//     } catch (err) {
//       console.error("Send error:", err);
//     }
//   };

//   return (
//     <Container fluid className="mt-4">
//       <Row>
//         {/* Conversations List */}
//         <Col md={3} style={{ borderRight: "1px solid #ddd", height: "80vh", overflowY: "auto" }}>
//           <h5>Messages</h5>
//           {conversations.map((conv, i) => (
//             <div
//               key={i}
//               onClick={() => setSelectedChat(conv)}
//               style={{
//                 padding: "10px",
//                 backgroundColor:
//                   selectedChat?.itemId === conv.itemId &&
//                   selectedChat?.userId === conv.userId
//                     ? "#f0f0f0"
//                     : "transparent",
//                 cursor: "pointer",
//               }}
//             >
//               <div><strong>With:</strong> {conv.username}</div>
//               <div style={{ fontSize: "0.8em", color: "#888" }}>{conv.lastMessage}</div>
//             </div>
//           ))}
//         </Col>

//         {/* Chat Panel */}
//         <Col md={6}>
//           {selectedChat ? (
//             <>
//               <h5 className="mb-3">Chat with {selectedChat.username}</h5>
//               <div style={{ height: "60vh", overflowY: "auto", border: "1px solid #ccc", padding: 10 }}>
//                 {chatLog.map((msg, i) => (
//                   <div key={i} style={{ marginBottom: "10px" }}>
//                     <strong>{msg.senderId === user._id ? "You" : selectedChat.username}</strong>: {msg.content}
//                     <div style={{ fontSize: "0.8em", color: "#999" }}>
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
//                 <Button type="submit" className="mt-2" disabled={!message.trim()}>
//                   Send
//                 </Button>
//               </Form>
//             </>
//           ) : (
//             <p className="text-muted mt-5">Select a conversation to begin</p>
//           )}
//         </Col>

//         {/* Item Details */}
//         <Col md={3} style={{ borderLeft: "1px solid #ddd" }}>
//           <h5>Listing Info</h5>
//           {listing ? (
//             <div className="mt-3">
//               {listing.imageUrl && (
//                 <img
//                   src={`${API_BASE}${listing.imageUrl}`}
//                   alt={listing.title}
//                   style={{ width: "100%", borderRadius: "5px", marginBottom: "10px" }}
//                 />
//               )}
//               {listing.videoUrl && (
//                 <video controls style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}>
//                   <source src={`${API_BASE}${listing.videoUrl}`} type="video/mp4" />
//                 </video>
//               )}
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