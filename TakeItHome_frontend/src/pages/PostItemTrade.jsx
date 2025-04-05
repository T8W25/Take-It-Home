import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function PostItemTrade() {
  const [items, setItems] = useState([]);

  const API_BASE = "http://localhost:3002/api/trade-items";

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/all`);
      if (!res.ok) throw new Error("Failed to fetch items");
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
    }
  };

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Posted Trade Listings</h3>
      <Row>
        {items.map((item) => (
          <Col md={4} key={item._id} className="mb-4">
            <Link to={`/trade/${item._id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <Card>
                {item.imageUrl && (
                  <Card.Img
                    variant="top"
                    src={`http://localhost:3002${item.imageUrl}`}
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                )}
                {!item.imageUrl && item.videoUrl && (
                  <video controls style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}>
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
              </Card>
            </Link>
            <div className="mt-2 d-flex justify-content-between align-items-center">
              <Button variant="danger" onClick={() => handleDelete(item._id)} className="w-100">
                Delete
              </Button>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default PostItemTrade;