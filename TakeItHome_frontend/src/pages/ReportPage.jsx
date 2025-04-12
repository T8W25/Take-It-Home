import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, Container, Row, Col, Alert, Form } from "react-bootstrap";

function ReportPage() {
  const { id, type } = useParams();  // Retrieve both item ID and type (trade or donate) from the URL
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState(null);
  const [reason, setReason] = useState("");  // State to hold the report reason

  // Set base URL dynamically based on item type
  const API_BASE = type === "trade" ? "http://localhost:3002/api/trade-items" : "https://take-it-home-8ldm.onrender.com/api/donation-items"; 

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch item details");
        const data = await res.json();
        setItem(data);  // Set the item data into state
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setMessage({ type: "danger", text: "Failed to load item details" });
      }
    };
    fetchItemDetails();
  }, [id, type]);

  const handleReport = async () => {
    if (!reason) {
      setMessage({ type: "danger", text: "Please provide a reason for reporting." });
      return;
    }

    const token = localStorage.getItem("jwtToken");
    try {
      const res = await fetch(`${API_BASE}/report/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",  // Sending JSON body
        },
        body: JSON.stringify({ reason }),  // Include the reason in the body
      });
      if (!res.ok) throw new Error("Failed to report item");
      setMessage({ type: "success", text: "Item reported successfully!" });
    } catch (err) {
      console.error("❌ Report error:", err);
      setMessage({ type: "danger", text: "Failed to report item" });
    }
  };

  if (!item) return <div>Loading...</div>;  // Show loading while data is fetched

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={8}>
          <h2 className="text-center mb-4">
            Report {type === "trade" ? "Trade" : "Donation"} Item
          </h2>

          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Card>
            {item.imageUrl && (
              <Card.Img
                variant="top"
                src={`https://take-it-home-8ldm.onrender.com${item.imageUrl}`}
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
            )}
            <Card.Body>
              <Card.Title>{item.title}</Card.Title>
              <Card.Text>
                <strong>Category:</strong> {item.category} <br />
                <strong>Condition:</strong> {item.condition} <br />
                <strong>Location:</strong> {item.location} <br />
                <strong>Description:</strong> {item.description} <br />
              </Card.Text>

              <Form.Group className="mb-3">
                <Form.Label>Reason for Reporting</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}  // Update reason state
                  placeholder="Please explain why you are reporting this item..."
                  required
                />
              </Form.Group>

              <Button variant="danger" onClick={handleReport} className="w-100">
                Report Item
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ReportPage;
