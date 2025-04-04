import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';


const ReportPage = () => {
  const { itemId } = useParams();  // Get the itemId from the URL
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!reason) {
      setMessage({ type: 'danger', text: 'Reason is required.' });
      return;
    }


    const token = localStorage.getItem('jwtToken');  // Assuming JWT is stored in localStorage


    try {
      const response = await fetch(`http://localhost:3002/api/reports/${itemId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,  // Attach JWT token
        },
        body: JSON.stringify({ reason }),  // Pass reason in the body
      });


      const data = await response.json();


      if (!response.ok) throw new Error(data.message || 'Failed to submit the report.');


      setMessage({ type: 'success', text: 'Report submitted successfully!' });


      // Optional: Redirect to the donation items page
      setTimeout(() => navigate('/donate-item'), 2000); // Redirect after 2 seconds
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    }
  };


  return (
    <div>
      <h3>Report Item</h3>
      {itemId && (
        <div>
          <p>Reporting Item with ID: {itemId}</p> {/* Display the itemId from the URL */}
        </div>
      )}
     
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
