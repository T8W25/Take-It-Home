import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Spinner, Alert } from "react-bootstrap";

function DonationItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = "http://localhost:3002/api/donation-items";

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) throw new Error("Item not found");
        const data = await res.json();
        setItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <Card>
        {item.imageUrl && (
          <Card.Img
            variant="top"
            src={`http://localhost:3002${item.imageUrl}`}
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
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
    </Container>
  );
}

export default DonationItemDetail;
