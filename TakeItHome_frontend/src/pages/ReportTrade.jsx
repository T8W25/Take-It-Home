import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import "./ReportTrade.css"; // Optional: for any custom styles

function ReportTrade() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    try {
      const response = await fetch("http://localhost:3002/api/reports/trade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId: id,
          reason,
          details,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit report");

      setSuccess(true);
      setReason("");
      setDetails("");
      setTimeout(() => navigate("/trade-item"), 2000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-lg report-card" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="mb-3 text-center">Report Trade Item</h3>

        {success && <Alert variant="success">Report submitted successfully!</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="reportReason" className="mb-3">
            <Form.Label>Reason for Report</Form.Label>
            <Form.Select value={reason} onChange={(e) => setReason(e.target.value)} required>
              <option value="">Select a reason</option>
              <option value="Inappropriate Content">Inappropriate Content</option>
              <option value="Fraud or Scam">Fraud or Scam</option>
              <option value="Spam">Spam</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="reportDetails" className="mb-4">
            <Form.Label>Additional Details</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Add any extra info..."
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
            <Button variant="danger" type="submit">Submit Report</Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default ReportTrade;
