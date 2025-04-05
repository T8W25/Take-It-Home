import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import "./PostDonationFromAccount.css"; // ✅ Make sure this file exists

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
      setMessage({ type: "danger", text: "All fields and image are required." });
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

      // Reset form
      setTitle("");
      setCategory("");
      setCondition("");
      setDescription("");
      setLocation("");
      setImage(null);
      setVideo(null);
    } catch (err) {
      setMessage({ type: "danger", text: err.message });
    }
  };

  return (
    <Container className="post-donation-container mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="post-donation-title">Post Donation Item</h2>

          {message && <Alert variant={message.type} className="alert-custom">{message.text}</Alert>}

          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label className="form-label-glow">Item Name</Form.Label>
              <Form.Control
                className="form-control-glow"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter item name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-glow">Category</Form.Label>
              <Form.Select
                className="form-select-glow"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-glow">Condition</Form.Label>
              <Form.Select
                className="form-select-glow"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-glow">Location</Form.Label>
              <Form.Control
                className="form-control-glow"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-glow">Description</Form.Label>
              <Form.Control
                className="form-control-glow"
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-glow">Image</Form.Label>
              <Form.Control
                className="file-input-glow"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-glow">Video (Optional)</Form.Label>
              <Form.Control
                className="file-input-glow"
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
              />
            </Form.Group>

            <Button type="submit" className="submit-btn-glow w-100">
              Post Donation Item
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PostDonationFromAccount;
