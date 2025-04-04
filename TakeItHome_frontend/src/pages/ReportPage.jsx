import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const ReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState(null);
  const [itemId, setItemId] = useState(null);

  // Simulate getting logged-in user's ID (replace with real logic)
  const userId = localStorage.getItem("userId"); // 👈 Set this when user logs in

  useEffect(() => {
    // Extract itemId passed through navigation state
    if (location.state?.itemId) {
      setItemId(location.state.itemId);
    } else {
      setMessage({ type: 'danger', text: 'No item ID provided for reporting.' });
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason) {
      setMessage({ type: 'danger', text: 'Reason is required.' });
      return;
    }

    if (!userId) {
      setMessage({ type: 'danger', text: 'User ID not found. Please log in first.' });
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType: "item",
          itemId,
          userId,
          message: reason,
          status: "pending",
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to submit the report.');

      setMessage({ type: 'success', text: 'Report submitted successfully!' });

      // Redirect after a delay
      setTimeout(() => navigate('/donate-item'), 2000);
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    }
  };

  return (
    <div className="container mt-5">
      <h3>Report Item</h3>

      {itemId && <p>Reporting Item with ID: <strong>{itemId}</strong></p>}

      {message && <Alert variant={message.type}>{message.text}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Reason for Reporting</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter the reason for reporting the item"
            required
          />
        </Form.Group>
        <Button variant="danger" type="submit" className="mt-3">
          Submit Report
        </Button>
      </Form>
    </div>
  );
};

export default ReportPage;
