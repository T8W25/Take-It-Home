import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';

const DonationItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [requestStatus, setRequestStatus] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`http://localhost:3002/api/donation-items/${id}`);
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

  const handleRequestSubmit = async () => {
    if (!name || !email || !phoneNumber || !userLocation || !requestMessage) {
      setRequestStatus({ type: 'danger', text: 'Please fill in all fields.' });
      return;
    }

    try {
      // This is a placeholder – replace with actual request POST call later if backend is ready
      console.log({
        name, email, phoneNumber, userLocation, message: requestMessage
      });

      setRequestStatus({ type: 'success', text: 'Your request has been sent successfully!' });
      setShowModal(false);

      // Clear form
      setName('');
      setEmail('');
      setPhoneNumber('');
      setUserLocation('');
      setRequestMessage('');
    } catch (error) {
      console.error("Request failed:", error);
      setRequestStatus({ type: 'danger', text: 'Failed to send request.' });
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (!item) return <div className="text-center mt-5">Item not found</div>;

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Donation Item Details</h3>
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

          <Button variant="primary" onClick={() => setShowModal(true)}>
            Send Request
          </Button>
        </Card.Body>
      </Card>

      {/* Modal for request form */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Request for {item.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {requestStatus && <Alert variant={requestStatus.type}>{requestStatus.text}</Alert>}
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Your Location</Form.Label>
              <Form.Control value={userLocation} onChange={(e) => setUserLocation(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleRequestSubmit}>Send</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DonationItemDetail;
