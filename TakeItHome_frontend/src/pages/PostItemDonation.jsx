import React, { useState, useEffect } from "react";
import { Button, Container, Alert, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./PostItemDonation.css";

function PostItemDonation() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState(null);

  const API_BASE = "http://localhost:3002/api/donation-items";

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/all`);
      if (!res.ok) throw new Error("Failed to fetch donation items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await fetch(`${API_BASE}/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete item");
      fetchItems();
    } catch (err) {
      console.error("❌ Delete error:", err);
  const handleMarkAsDonated = async (id) => {
    if (!window.confirm("Are you sure this item has been picked up and donated?")) return;

    try {
      const res = await fetch(`${API_BASE}/donated/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to mark as donated");

      setMessage({ type: "success", text: "Item marked as donated." });
      fetchItems();
    } catch (error) {
      setMessage({ type: "danger", text: error.message });
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
            <Link to={`/donate/${item._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {item.imageUrl && (
                <Card.Img variant="top" src={`http://localhost:3002${item.imageUrl}`} />
              )}
              {!item.imageUrl && item.videoUrl && (
                <video controls>
                  <source src={`http://localhost:3002${item.videoUrl}`} type="video/mp4" />
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
                <Button variant="info" size="sm" className="me-2">Report</Button>
              </Link>

              {!item.donated ? (
                <Button variant="success" size="sm" onClick={() => handleMarkAsDonated(item._id)}>
                  Mark as Donated
                </Button>
              ) : (
                <span className="text-success fw-bold">Donated</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
  }}

export default PostItemDonation;
