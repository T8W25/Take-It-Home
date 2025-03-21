import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";

function PostItemDonation() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);
  const [donations, setDonations] = useState([]);  // ✅ Used properly

  const API_BASE = "http://localhost:3000/api/donation-items";

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await fetch(`${API_BASE}`);
      const data = await res.json();
      setDonations(data);  // ✅ Correctly set state
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !condition || !description || !image) {
      setMessage({ type: "danger", text: "All fields are required" });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const res = await fetch(`${API_BASE}`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Error posting item");
      }

      setMessage({ type: "success", text: "Item posted successfully" });
      setTitle("");
      setCategory("");
      setCondition("");
      setDescription("");
      setImage(null);
      fetchDonations();  // ✅ Refresh donation list after posting
    } catch (err) {
      console.error("Post error:", err);
      setMessage({ type: "danger", text: err.message });
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Post a Donation Item</h2>

          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter item name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Condition</Form.Label>
              <Form.Select value={condition} onChange={(e) => setCondition(e.target.value)}>
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter item description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Post Item
            </Button>
          </Form>
        </Col>
      </Row>

      <hr className="my-5" />
      <h3 className="text-center">Posted Donations</h3>
      <Row>
        {donations.map((donation) => (
          <Col md={4} key={donation._id} className="mb-4">
            <Card>
              {donation.imageUrl && (
                <Card.Img
                  variant="top"
                  src={`http://localhost:3000${donation.imageUrl}`}
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                />
              )}
              <Card.Body>
                <Card.Title>{donation.title}</Card.Title>
                <Card.Text>{donation.description}</Card.Text>
                <Card.Text>
                  <strong>Category:</strong> {donation.category} <br />
                  <strong>Condition:</strong> {donation.condition}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default PostItemDonation;
