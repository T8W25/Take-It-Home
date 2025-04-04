// src/pages/ReportPage.jsx
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const ReportPage = () => {
  const [reportReason, setReportReason] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the item ID from the URL
  const itemId = location.state?.itemId;

  const handleReportSubmit = async (e) => {
    e.preventDefault();

    if (!reportReason) {
      setMessage({ type: 'danger', text: 'Please select a reason for reporting.' });
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      const res = await fetch(`http://localhost:3002/api/report/${itemId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: reportReason }),
      });

      if (!res.ok) throw new Error('Failed to submit the report.');

      setMessage({ type: 'success', text: 'Report submitted successfully!' });

      // Optionally, navigate back or to another page
      setTimeout(() => {
        navigate('/');  // Redirecting to homepage or another page after successful submission
      }, 1500);
    } catch (err) {
      console.error('❌ Report error:', err);
      setMessage({ type: 'danger', text: err.message });
    }
  };

  return (
    <Container className="mt-5">
      {message && (
        <Row className="justify-content-center">
          <Col md={8}>
            <Alert variant={message.type}>{message.text}</Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col md={6} className="offset-md-3">
          <h3 className="text-center">Report Item</h3>
          <Form onSubmit={handleReportSubmit}>
            {/* Report Reason */}
            <Form.Group className="mb-3">
              <Form.Label>Reason for Reporting</Form.Label>
              <Form.Control
                as="select"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                required
              >
                <option value="">Select a reason</option>
                <option value="Inappropriate content">Inappropriate content</option>
                <option value="Misleading description">Misleading description</option>
                <option value="Duplicate post">Duplicate post</option>
                <option value="Spam">Spam</option>
                <option value="Other">Other</option>
              </Form.Control>
            </Form.Group>

            {/* Submit Report */}
            <Button type="submit" variant="danger" className="w-100">
              Submit Report
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportPage;
