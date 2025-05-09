import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Spinner, Button } from 'react-bootstrap';

const API_BASE ='https://take-it-home-8ldm.onrender.com';

const DonationItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/donation-items/${id}`);
        if (!res.ok) throw new Error("Failed to fetch item");
        const data = await res.json();
        setItem(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (!item) return <div className="text-center mt-5">Item not found</div>;

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Donation Listing Details</h3>
      <Card>
        {item.imageBase64 ? (
          <Card.Img
            variant="top"
            src={item.imageBase64}
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        ) : item.imageUrl ? (
          <Card.Img
            variant="top"
            src={`${API_BASE}${item.imageUrl}`}
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        ) : (
          <Card.Text className="text-center p-4 text-muted">No Image</Card.Text>
        )}

        {item.videoUrl && (
          <video controls style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}>
            <source src={`${API_BASE}${item.videoUrl}`} type="video/mp4" />
          </video>
        )}

        <Card.Body>
          <Card.Title>{item.title}</Card.Title>
          <Card.Text><strong>Description:</strong> {item.description}</Card.Text>
          <Card.Text><strong>Category:</strong> {item.category}</Card.Text>
          <Card.Text><strong>Condition:</strong> {item.condition}</Card.Text>
          <Card.Text><strong>Location:</strong> {item.location}</Card.Text>

          <Button
            variant="primary"
            className="mt-3"
            onClick={() =>
              navigate(`/donate/${item._id}/message`, {
                state: {
                  itemTitle: item.title,
                  receiverId: item.userId,
                  itemType: "donation"
                }
              })
            }
          >
            Send Request
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DonationItemDetail;
