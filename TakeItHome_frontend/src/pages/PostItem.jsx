import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";

function PostItem() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null); // Support video upload
  const [message, setMessage] = useState(null);
  const [items, setItems] = useState([]);

  const API_BASE = "http://localhost:3000/api/trade-items";

  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch posted items from the backend
  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/all`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !condition || !description) {
      setMessage({ type: "danger", text: "All fields except video are required!" });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("description", description);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video); // Add video if provided

    try {
      const token = localStorage.getItem("jwtToken"); // Ensure user authentication
      const res = await fetch(`${API_BASE}/post`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Error posting item");
      }

      setMessage({ type: "success", text: "Item posted successfully!" });
      setTitle("");
      setCategory("");
      setCondition("");
      setDescription("");
      setImage(null);
      setVideo(null);
      fetchItems(); // Refresh posted items
    } catch (err) {
      console.error("Post error:", err);
      setMessage({ type: "danger", text: err.message });
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Post a Trade Item</h2>

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
              </Form.Select>
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
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Video (Optional)</Form.Label>
              <Form.Control
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Post Item
            </Button>
          </Form>
        </Col>
      </Row>

      <hr className="my-5" />
      <h3 className="text-center">Posted Items</h3>
      <Row>
        {items.map((item) => (
          <Col md={4} key={item._id} className="mb-4">
            <Card>
              {item.imageUrl && (
                <Card.Img
                  variant="top"
                  src={`http://localhost:3000${item.imageUrl}`}
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                />
              )}
              {item.videoUrl && (
                <video width="100%" controls>
                  <source src={`http://localhost:3000${item.videoUrl}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Card.Text>
                  <strong>Category:</strong> {item.category} <br />
                  <strong>Condition:</strong> {item.condition}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default PostItem;
