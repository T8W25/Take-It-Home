import React, { useState, useEffect } from "react";
import { Button, Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./PostItemTrade.css";

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



  return (
    <Container className="trade-container">
      <h3 className="trade-title">Posted Trade Items</h3>
      <div className="item-grid">
        {items.map((item) => (
          <div key={item._id} className="item-card">
            <Link to={`/trade/${item._id}`} style={{ textDecoration: "none", color: "inherit" }}>
              {item.imageUrl && (
                <Card.Img src={`http://localhost:3002${item.imageUrl}`} />
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
              <Link to={`/report-trade/${item._id}`}>
                <Button variant="info">Report</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default PostItemTrade;
