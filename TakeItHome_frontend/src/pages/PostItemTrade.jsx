import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

function PostItemTrade() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState(null);
  const [items, setItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  const API_BASE = "http://localhost:3002/api/trade-items";
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, [navigate]);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/all`);
      if (!res.ok) throw new Error("Failed to fetch items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !condition || !description || !location || (!image && !video && !editMode)) {
      setMessage({ type: "danger", text: "All fields (including location) are required with at least one media file." });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("description", description);
    formData.append("location", location);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    const token = localStorage.getItem("jwtToken");

    try {
      let res;
      if (editMode) {
        res = await fetch(`${API_BASE}/edit/${editItemId}`, {
          method: "POST", // using POST instead of PUT
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        
      } else {
        res = await fetch(`${API_BASE}/post`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      }

      if (!res.ok) throw new Error(editMode ? "Failed to update item" : "Failed to post item");

      // const result = await res.json();
      setMessage({ type: "success", text: editMode ? "Item updated successfully!" : "Item posted successfully!" });
      resetForm();
      fetchItems();
    } catch (err) {
      console.error("❌ Post error:", err);
      setMessage({ type: "danger", text: err.message });
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setCondition("");
    setDescription("");
    setLocation("");
    setImage(null);
    setVideo(null);
    setEditMode(false);
    setEditItemId(null);
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setEditItemId(item._id);
    setTitle(item.title);
    setCategory(item.category);
    setCondition(item.condition);
    setDescription(item.description);
    setLocation(item.location);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await fetch(`${API_BASE}/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete item");
      fetchItems();
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">{editMode ? "Edit" : "Post a"} Trade Item</h2>

          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter item name" required />
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
              <Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter your location" required />
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
              <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter item description" required />
            </Form.Group>

            {!editMode && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Video (Optional)</Form.Label>
                  <Form.Control type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
                </Form.Group>
              </>
            )}

            <Button type="submit" variant="primary" className="w-100">
              {editMode ? "Update Item" : "Post Item"}
            </Button>
          </Form>
        </Col>
      </Row>

      <hr className="my-5" />
      <h3 className="text-center">Posted Trade Listings</h3>
      <Row>
        {items.map((item) => (
          <Col md={4} key={item._id} className="mb-4">
            <Link to={`/trade/${item._id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <Card>
                {item.imageUrl && (
                  <Card.Img
                    variant="top"
                    src={`http://localhost:3002${item.imageUrl}`}
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                )}
                {!item.imageUrl && item.videoUrl && (
                  <video controls style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}>
                    <source src={`http://localhost:3002${item.videoUrl}`} type="video/mp4" />
                  </video>
                )}
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Card.Text>
                    <strong>Category:</strong> {item.category} <br />
                    <strong>Condition:</strong> {item.condition} <br />
                    <strong>Location:</strong> {item.location}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
            <div className="mt-2 d-flex justify-content-between">
              <Button variant="secondary" onClick={() => handleEditClick(item)}>Edit</Button>
              <Button variant="danger" onClick={() => handleDeleteClick(item._id)}>Delete</Button>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default PostItemTrade;