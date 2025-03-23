import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";

function ItemDetail() {
  const { type, id } = useParams();
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/${type}-items/${id}`);
        setItem(response.data);
      } catch (error) {
        setMessage("Item not found or an error occurred");
        console.error("Fetch Error:", error);
      }
    };

    fetchItem();
  }, [type, id]);

  if (!item) return <div>{message}</div>;

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6}>
          {/* Media Section */}
          {item.imageUrl && (
            <Card.Img
              src={`http://localhost:3002${item.imageUrl}`}
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          )}
          {item.videoUrl && (
            <video controls style={{ width: "100%", maxHeight: "400px" }}>
              <source src={`http://localhost:3002${item.videoUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>{item.title}</Card.Title>
              <Card.Text>{item.description}</Card.Text>
              <Card.Text>
                <strong>Category:</strong> {item.category} <br />
                <strong>Condition:</strong> {item.condition} <br />
                <strong>Location:</strong> {item.location} <br />
                <strong>Posted By:</strong> {item.user?.email || "Anonymous"}
              </Card.Text>

              {/* Action Buttons */}
              {type === "trade" && (
                <Button variant="primary">Send Trade Request</Button>
              )}
              {type === "donation" && (
                <Button variant="success">Request Donation</Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ItemDetail;
