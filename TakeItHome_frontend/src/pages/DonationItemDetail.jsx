import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Card, Spinner, Button, Form, Modal, Alert
} from 'react-bootstrap';

const DonationItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [requestStatus, setRequestStatus] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`http://localhost:3002/api/donation-items/${id}`);
        if (!res.ok) throw new Error('Failed to fetch item');
        const data = await res.json();
        setItem(data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleRequestSubmit = () => {
    if (!name || !email || !phoneNumber || !message) {
      setRequestStatus({
        type: 'danger',
        text: 'Please fill in all fields before submitting your request.',
      });
      return;
    }

    console.log(`Request for Item: ${item.title}`);
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${phoneNumber}`);
    console.log(`Message: ${message}`);

    setRequestStatus({
      type: 'success',
      text: 'Your request has been sent successfully!',
    });

    setShowModal(false);
    setName('');
    setEmail('');
    setPhoneNumber('');
    setMessage('');
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
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        )}
        {item.videoUrl && (
          <video controls style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}>
            <source src={`http://localhost:3002${item.videoUrl}`} type="video/mp4" />
          </video>
        )}
        <Card.Body>
          <Card.Title>{item.title}</Card.Title>
          <Card.Text><strong>Description:</strong> {item.description}</Card.Text>
          <Card.Text><strong>Category:</strong> {item.category}</Card.Text>
          <Card.Text><strong>Condition:</strong> {item.condition}</Card.Text>
          <Card.Text><strong>Location:</strong> {item.location}</Card.Text>

          <Button variant="primary" className="mt-3" onClick={() => setShowModal(true)}>
            Send Request
          </Button>
        </Card.Body>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Request for Item: {item.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {requestStatus && <Alert variant={requestStatus.type}>{requestStatus.text}</Alert>}
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter a message for the item owner"
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleRequestSubmit}>Submit Request</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DonationItemDetail;
