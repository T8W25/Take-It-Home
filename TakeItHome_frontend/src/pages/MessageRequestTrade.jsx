// import React, { useState } from 'react';
// import { useLocation, useParams, useNavigate } from 'react-router-dom';
// import { Container, Form, Button, Alert } from 'react-bootstrap';

// const MessageRequestDonation = () => {
//   const { id } = useParams();
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const receiverId = state?.receiverId;
//   const itemTitle = state?.itemTitle || "Trade Item";

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!message.trim()) {
//       setError("Message cannot be empty.");
//       return;
//     }

//     const token = localStorage.getItem("jwtToken");
//     if (!token) {
//       setError("You must be logged in to send a request.");
//       return;
//     }

//     if (!receiverId) {
//       setError("Missing receiver info. Please try again.");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:3002/api/requests", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           message,
//           itemId: id,
//           itemType: "trade",
//           receiverId
//         })
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message);

//       setSuccess("Request sent successfully!");
//       setMessage('');
//       setError('');
//       setTimeout(() => navigate('/notifications'), 2000);
//     } catch (err) {
//       setError(err.message || "Something went wrong.");
//     }
//   };

//   return (
//     <Container className="mt-5">
//       <h3>Send a Donation Request for: <strong>{itemTitle}</strong></h3>
//       <Form onSubmit={handleSubmit} className="mt-4">
//         <Form.Group controlId="message">
//           <Form.Label>Message</Form.Label>
//           <Form.Control
//             as="textarea"
//             rows={4}
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Explain why you're interested in this donation item..."
//           />
//         </Form.Group>
//         {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
//         {success && <Alert variant="success" className="mt-3">{success}</Alert>}
//         <Button type="submit" variant="primary" className="mt-3">Send Request</Button>
//       </Form>
//     </Container>
//   );
// };

// export default MessageRequestDonation;

import React, { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const MessageRequest = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const receiverId = state?.receiverId;
  const itemTitle = state?.itemTitle || "Item";
  const itemType = state?.itemType || "trade";  // Default to "trade", but update if it's "donation"

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("You must be logged in to send a request.");
      return;
    }

    if (!receiverId) {
      setError("Missing receiver info. Please try again.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3002/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message,
          itemId: id,
          itemType, // Dynamically use the itemType from the state
          receiverId
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setSuccess("Request sent successfully!");
      setMessage('');
      setError('');
      setTimeout(() => navigate('/notifications'), 2000);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <Container className="mt-5">
      <h3>Send a {itemType === "trade" ? "Trade" : "Donation"} Request for: <strong>{itemTitle}</strong></h3>
      <Form onSubmit={handleSubmit} className="mt-4">
        <Form.Group controlId="message">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Explain why you're interested in this ${itemType === "trade" ? "trade" : "donation"} item...`}
          />
        </Form.Group>
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        {success && <Alert variant="success" className="mt-3">{success}</Alert>}
        <Button type="submit" variant="primary" className="mt-3">Send Request</Button>
      </Form>
    </Container>
  );
};

export default MessageRequest;
