import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";

function PostItem() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState(null);
  const [items, setItems] = useState([]); // ✅ Stores posted items

  const API_BASE = "http://localhost:3000/api/trade-items";

  // ✅ Fetch items when the page loads
  useEffect(() => {
    fetchItems();
  }, []);

  // ✅ Function to Fetch Items
  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/all`);
      if (!res.ok) {
        throw new Error("Failed to fetch items");
      }
      const data = await res.json();
      setItems(data); // ✅ Store fetched items
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  // ✅ Handle Submit Function
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !condition || !description || (!image && !video)) {
      setMessage({ type: "danger", text: "All fields are required, including at least one media file." });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("description", description);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    try {
      const res = await fetch(`${API_BASE}/post`, {
        method: "POST",
        body: formData,
      });

      // ✅ LOG THE RAW RESPONSE
      const text = await res.text();
      console.log("RAW RESPONSE:", text);
      
      const result = JSON.parse(text);
      if (!res.ok) {
        throw new Error(result.message || "Failed to post item");
      }

      console.log("✅ Item Posted:", result);
      setMessage({ type: "success", text: "Item posted successfully!" });

      // ✅ Clear Form
      setTitle("");
      setCategory("");
      setCondition("");
      setDescription("");
      setImage(null);
      setVideo(null);

      // ✅ Fetch updated items
      fetchItems();
    } catch (err) {
      console.error("❌ Post error:", err);
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
              <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter item name" />
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
              <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter item description" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Video (Optional)</Form.Label>
              <Form.Control type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">Post Item</Button>
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
                <Card.Img variant="top" src={`http://localhost:3000${item.imageUrl}`} style={{ maxHeight: "200px", objectFit: "cover" }} />
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
