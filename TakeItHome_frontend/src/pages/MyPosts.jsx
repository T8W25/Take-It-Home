import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { API_BASE } from "../config";

const MyPosts = () => {
  const [tradeItems, setTradeItems] = useState([]);
  const [donationItems, setDonationItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch trade items
        const tradeRes = await fetch(`${API_BASE}/api/trade-items/my-posts`, { headers });
        if (!tradeRes.ok) throw new Error("Failed to fetch trade items");
        const tradeData = await tradeRes.json();
        console.log("Trade Items Response:", tradeData); // Debug log
        setTradeItems(tradeData);

        // Fetch donation items
        const donationRes = await fetch(`${API_BASE}/api/donation-items/my-posts`, { headers });
        if (!donationRes.ok) throw new Error("Failed to fetch donation items");
        const donationData = await donationRes.json();
        console.log("Donation Items Response:", donationData); // Debug log
        setDonationItems(donationData);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load posts. Check console for details.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyItems();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container className="mt-4">
      {/* Trade Posts */}
      <h3>My Trade Posts</h3>
      {tradeItems.length === 0 && <p>No trade posts found.</p>}
      <Row>
        {tradeItems.map((item) => (
          <Col md={4} key={item._id}>
            <Card>
              <Card.Img
                variant="top"
                src={item.imageBase64 ? item.imageBase64 : "/default-image.jpg"} // Handle missing images
              />
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Button variant="primary">Edit</Button>
                <Button variant="danger">Delete</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Donation Posts */}
      <h3 className="mt-5">My Donation Posts</h3>
      {donationItems.length === 0 && <p>No donation posts found.</p>}
      <Row>
        {donationItems.map((item) => (
          <Col md={4} key={item._id}>
            <Card>
              <Card.Img
                variant="top"
                src={item.imageUrl ? `${API_BASE}${item.imageUrl}` : "/default-image.jpg"} // Handle missing images
              />
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Button variant="primary">Edit</Button>
                <Button variant="danger">Delete</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MyPosts;
