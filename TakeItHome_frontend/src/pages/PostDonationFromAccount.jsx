import "./PostDonationFromAccount.css";
import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";


const PostDonationFromAccount = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState(null);

  const API_BASE = "http://localhost:3002/api/donation-items";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !condition || !description || !location || !image) {
      setMessage({ type: "danger", text: "All fields and at least an image are required." });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("image", image);
    if (video) formData.append("video", video);

    try {
      const res = await fetch(`${API_BASE}/post`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to post donation item");

      setMessage({ type: "success", text: "Item posted successfully!" });
      setTitle("");
      setCategory("");
      setCondition("");
      setDescription("");
      setLocation("");
      setImage(null);
      setVideo(null);
    } catch (err) {
      console.error("❌ Post error:", err);
      setMessage({ type: "danger", text: err.message });
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Post Donation Item</h2>

          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter item name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Condition</Form.Label>
              <Form.Select value={condition} onChange={(e) => setCondition(e.target.value)} required>
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
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Video (Optional)</Form.Label>
              <Form.Control type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Post Donation Item
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PostDonationFromAccount;