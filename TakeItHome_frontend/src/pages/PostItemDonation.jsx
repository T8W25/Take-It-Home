import React, { useState, useEffect } from "react";
import { Button, Container, Alert, Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./PostItemDonation.css";

function PostItemDonation() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState(null);
  const API_BASE = "https://take-it-home-8ldm.onrender.com/api/donation-items";

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/all`);
      if (!res.ok) throw new Error("Failed to fetch donation items");
      const data = await res.json();
      console.log("Donation items (PostItemDonation):", data);
      setItems(data);
    } catch (err) {
      console.error("❌ Fetch error (PostItemDonation):", err);
      setMessage({ type: "danger", text: err.message });
    }
  };



  return (
    <Container className="donation-container">
      <h3 className="donation-title">Posted Donation Items</h3>

      {message && (
        <Alert variant={message.type} className="mb-4">
          {message.text}
        </Alert>
      )}

      <div className="donation-grid">
        {items.map((item) => (
          <div className="donation-card" key={item._id}>
            <Link to={`/donate/${item._id}`} style={{ textDecoration: "none", color: "inherit" }}>
              {item.imageUrl && (
                <Card.Img variant="top" src={`https://take-it-home-8ldm.onrender.com${item.imageUrl}`} />
              )}
              {!item.imageUrl && item.videoUrl && (
                <video controls>
                  <source src={`https://take-it-home-8ldm.onrender.com${item.videoUrl}`} type="video/mp4" />
                </video>
              )}
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Card.Text>
                  <strong>Category:</strong> {item.category} <br />
                  <strong>Condition:</strong> {item.condition} <br />
                  <strong>Location:</strong> {item.location}
                </Card.Text>
              </Card.Body>
            </Link>

            <div className="card-actions">
              <Link to={`/report/${item._id}`}>
                <Button variant="info" size="sm" className="me-2">
                  Report
                </Button>
              </Link>
              {item.sold === true && (
                <Badge bg="success" className="sold-badge ms-2">
                  Sold
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default PostItemDonation;
