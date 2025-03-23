import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Spinner } from 'react-bootstrap';

const DonationItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`http://localhost:3002/api/donation-items/${id}`);
        console.log("Response status:", res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Failed to fetch item:", errorText);
          return;
        }

        const data = await res.json();
        console.log("Fetched item:", data);
        setItem(data); // ✅ set the item
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  if (!item) {
    return <div className="text-center mt-5">Item not found</div>;
  }

  return (
    <Container className="mt-5">
      <Card>
        {item.imageUrl && (
          <Card.Img
            variant="top"
            src={`http://localhost:3002${item.imageUrl}`}
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        )}
        {item.videoUrl && (
          <video controls style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}>
            <source src={`http://localhost:3002${item.videoUrl}`} type="video/mp4" />
          </video>
        )}
        <Card.Body>
          <Card.Title>{item.title}</Card.Title>
          <Card.Text><strong>Description:</strong> {item.description}</Card.Text>
          <Card.Text><strong>Category:</strong> {item.category}</Card.Text>
          <Card.Text><strong>Condition:</strong> {item.condition}</Card.Text>
          <Card.Text><strong>Location:</strong> {item.location}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DonationItemDetail;
