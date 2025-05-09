// import React, { useEffect, useState } from 'react';
// import { Container, Card, Spinner, Alert, Tabs, Tab, Button } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3002";

// const Notifications = () => {
//   const [requests, setRequests] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const userId = localStorage.getItem("userId");

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const token = localStorage.getItem("jwtToken");
//       if (!token) {
//         setError("Not authenticated.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await fetch(`${API_BASE}/api/requests/received`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         if (!res.ok) {
//           const text = await res.text();
//           throw new Error(text);
//         }

//         const data = await res.json();
//         setRequests(data);

//         setMessages([
//           {
//             _id: "msg1",
//             from: "Amina",
//             content: "Thanks for accepting my request!",
//             createdAt: new Date().toISOString(),
//             itemId: data[0]?.itemId, // Optional: attach a real itemId to demo message
//             senderId: data[0]?.senderId?._id // Optional fallback
//           }
//         ]);
//       } catch (err) {
//         setError(err.message || "Failed to load notifications");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   const handleAction = async (requestId, action) => {
//     try {
//       setLoading(true);
//       const res = await axios.put(
//         `${API_BASE}/api/requests/${requestId}/${action}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
//           }
//         }
//       );
//       if (res.status === 200) {
//         // Refresh requests
//         setRequests(prev =>
//           prev.map(req => 
//             req._id === requestId ? { ...req, status: action } : req
//           )
//         );
//       }
//     } catch (err) {
//       setError(err.message || "Failed to update request");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const pendingRequests = requests.filter(r => r.status === "pending");
//   const acceptedRequests = requests.filter(r => r.status === "accepted");
//   const declinedRequests = requests.filter(r => r.status === "declined");


//   const handleCancel = async (id) => {
//     const token = localStorage.getItem("jwtToken");
//     try {
//       const res = await fetch(`${API_BASE}/api/requests/${id}/cancel`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (res.ok) {
//         setRequests(prev => prev.filter(r => r._id !== id));
//       } else {
//         const result = await res.json();
//         alert(result.message || "Failed to cancel request.");
//       }
//     } catch (err) {
//       alert(err.message || "Cancel error");
//     }
//   };

//   const navigateToChat = (data) => {
//     navigate("/chat", {
//       state: {
//         itemId: data.itemId?._id || data.itemId,
//         receiverId: data.senderId?._id || data.senderId || data.from,
//         requestId: data._id
//       }
//     });
//   };

//   const renderRequestList = (list) => {
//   return list.map((req) => {
//     const isReceiver = req.receiverId === userId; // Simplified check
//     console.log("Rendering request:", req._id, "isReceiver:", isReceiver, "status:", req.status);

//     return (
//       <Card key={req._id} className="mb-3">
//         <Card.Body>
//           <Card.Title>
//             {req.itemId?.title || "Item"} ({req.itemType === "trade" ? "Trade" : "Donation"})
//           </Card.Title>
//           <Card.Text>
//             <strong>From:</strong> {req.senderId?.username || "Unknown"}<br />
//             <strong>Message:</strong> {req.message}<br />
//             <strong>Status:</strong>{" "}
//             <span className={`badge bg-${req.status === "pending" ? "warning" : req.status === "accepted" ? "success" : "danger"}`}>
//               {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
//             </span>
//           </Card.Text>

//           {/* Accept/Decline Buttons */}
//             <div className="d-flex justify-content-end mt-2">
//               <Button 
//                 variant="success" 
//                 size="sm" 
//                 onClick={() => handleAction(req._id, "accept")}
//               >
//                 Accept
//               </Button>
//               <Button 
//                 variant="danger" 
//                 size="sm" 
//                 className="ms-2"
//                 onClick={() => handleAction(req._id, "decline")}
//               >
//                 Decline
//               </Button>
//             </div>


//           {/* Chat Button */}
//           {req.status === "accepted" && (
//             <Button 
//               variant="primary" 
//               size="sm" 
//               className="mt-2"
//               onClick={() => navigateToChat(req)}
//             >
//               Chat
//             </Button>
//           )}
//         </Card.Body>
//       </Card>
//     );
//   });
// };


//   return (
//     <Container className="mt-5">
//       <h3 className="mb-4">Notifications</h3>

//       {loading && <Spinner animation="border" />}
//       {error && <Alert variant="danger">{error}</Alert>}

//       {!loading && (
//         <Tabs defaultActiveKey="pending" className="mb-3">
//           <Tab eventKey="pending" title={`Pending (${pendingRequests.length})`}>
//             {pendingRequests.length === 0 ? (
//               <Alert variant="info">No pending requests.</Alert>
//             ) : (
//               renderRequestList(pendingRequests)
//             )}
//           </Tab>

//           <Tab eventKey="accepted" title={`Accepted (${acceptedRequests.length})`}>
//             {acceptedRequests.length === 0 ? (
//               <Alert variant="info">No accepted requests.</Alert>
//             ) : (
//               renderRequestList(acceptedRequests)
//             )}
//           </Tab>

//           <Tab eventKey="declined" title={`Declined (${declinedRequests.length})`}>
//             {declinedRequests.length === 0 ? (
//               <Alert variant="info">No declined requests.</Alert>
//             ) : (
//               renderRequestList(declinedRequests)
//             )}
//           </Tab>

//           <Tab eventKey="messages" title={`Messages (${messages.length})`}>
//             {messages.length === 0 ? (
//               <Alert variant="info">No messages yet.</Alert>
//             ) : (
//               messages.map((msg) => (
//                 <Card
//                   key={msg._id}
//                   className="mb-3"
//                   style={{ cursor: "pointer" }}
//                   onClick={() => navigateToChat(msg)}
//                 >
//                   <Card.Body>
//                     <Card.Title>From: {msg.from}</Card.Title>
//                     <Card.Text>{msg.content}</Card.Text>
//                     <small className="text-muted">{new Date(msg.createdAt).toLocaleString()}</small>
//                   </Card.Body>
//                 </Card>
//               ))
//             )}
//           </Tab>
//         </Tabs>
//       )}
//     </Container>
//   );
// };

// export default Notifications;

import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner, Alert, Tabs, Tab, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE ="https://take-it-home-8ldm.onrender.com";

const Notifications = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // Using userId from localStorage (ensure this is set as a string)
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("Not authenticated.");
        setLoading(false);
        return;
      }
  
      try {
        const res = await fetch(`${API_BASE}/api/requests/received`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
  
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        setError(err.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
  
    fetchNotifications();
  }, []);
  
  const handleAction = async (requestId, action) => {
    const token = localStorage.getItem("jwtToken");
  
    if (!token) {
      setError("Authentication token missing");
      return;
    }
  
    try {
      setLoading(true);
  
      const res = await axios.put(
        `${API_BASE}/api/requests/${requestId}/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // NEW: If action is accept and the response includes a conversation, navigate to the chat page
      if (action === "accept" && res.data.conversation) {
        navigate("/chat", {
          state: {
            itemId: res.data.conversation.itemId,
            receiverId: res.data.conversation.userId,
            itemType: res.data.conversation.itemType,
            username: res.data.conversation.username
          }
        });
      } else {
        // Otherwise update local notifications state (for reject/cancel, etc.)
        setRequests((prev) => prev.filter((req) => req._id !== requestId));
      }
    } catch (err) {
      console.error("Request update failed:", err);
      setError("Failed to process the action.");
    } finally {
      setLoading(false);
    }
  };
  
  const navigateToChat = (chatData) => {
    navigate("/chat", {
      state: {
        itemId: chatData.itemId,
        receiverId: chatData.receiverId,
        itemType: chatData.itemType
      }
    });
  };
  
  const renderRequestList = (list) => {
    return list.map((req) => (
      <Card key={req._id} className="mb-3">
        <Card.Body>
          <Card.Title>
            {req.itemId?.title || "Item"} ({req.itemType === "trade" ? "Trade" : "Donation"})
          </Card.Title>
          <Card.Text>
            <strong>From:</strong> {req.senderId?.username || "Unknown"}<br />
            <strong>Message:</strong> {req.message}<br />
            <strong>Status:</strong>{" "}
            <span className={`badge bg-${
              req.status === "pending" ? "warning" :
              req.status === "accepted" ? "success" : "danger"
            }`}>
              {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
            </span>
          </Card.Text>
  
          {req.status === "pending" && (
            <div className="d-flex justify-content-end mt-2">
              <Button
                variant="success"
                size="sm"
                onClick={() =>
                  handleAction(req._id, "accept")
                }
              >
                Accept
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="ms-2"
                onClick={() => handleAction(req._id, "decline")}
              >
                Decline
              </Button>
            </div>
          )}
  
          {req.status === "accepted" && (
            <Button
              variant="primary"
              size="sm"
              className="mt-2"
              onClick={() => navigateToChat({
                itemId: req.itemId,
                receiverId: req.senderId,
                itemType: req.itemType
              })}
            >
              Chat
            </Button>
          )}
        </Card.Body>
      </Card>
    ));
  };
  
  return (
    <Container className="mt-5">
      <h3 className="mb-4">Notifications</h3>
  
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
  
      {!loading && (
        <Tabs defaultActiveKey="pending" className="mb-3">
          <Tab eventKey="pending" title={`Pending (${requests.filter(r => r.status === 'pending').length})`}>
            {requests.filter(r => r.status === 'pending').length === 0 ? (
              <Alert variant="info">No pending requests.</Alert>
            ) : (
              renderRequestList(requests.filter(r => r.status === 'pending'))
            )}
          </Tab>
  
          <Tab eventKey="accepted" title={`Accepted (${requests.filter(r => r.status === 'accepted').length})`}>
            {requests.filter(r => r.status === 'accepted').length === 0 ? (
              <Alert variant="info">No accepted requests.</Alert>
            ) : (
              renderRequestList(requests.filter(r => r.status === 'accepted'))
            )}
          </Tab>
  
          <Tab eventKey="declined" title={`Declined (${requests.filter(r => r.status === 'declined').length})`}>
            {requests.filter(r => r.status === 'declined').length === 0 ? (
              <Alert variant="info">No declined requests.</Alert>
            ) : (
              renderRequestList(requests.filter(r => r.status === 'declined'))
            )}
          </Tab>
        </Tabs>
      )}
    </Container>
  );
};
  
export default Notifications;
