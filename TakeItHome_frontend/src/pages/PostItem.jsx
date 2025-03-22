import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";

function PostItem() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(""); // Added location state
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState(null);
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const API_BASE = "http://localhost:3000/api/trade-items";
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

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

    // Validation: Ensure location is provided
    if (!title || !category || !condition || !description || !location || !(image || video)) {
      setMessage({ type: "danger", text: "All fields (including location) are required with at least one media file." });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("description", description);
    formData.append("location", location); // Include location in form data
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    const token = localStorage.getItem("jwtToken");

    try {
      let res;
      if (editingItem) {
        // If editing an existing post
        res = await fetch(`${API_BASE}/update/${editingItem._id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        // If posting a new item
        res = await fetch(`${API_BASE}/post`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      }

      if (!res.ok) {
        throw new Error("Failed to post item");
      }

      const result = await res.json();
      setMessage({ type: "success", text: editingItem ? "Item updated successfully!" : "Item posted successfully!" });

      // Reset fields
      setTitle("");
      setCategory("");
      setCondition("");
      setDescription("");
      setLocation(""); // Reset location
      setImage(null);
      setVideo(null);
      setEditingItem(null); // Clear editing state after submission
      fetchItems();
    } catch (err) {
      console.error("❌ Post error:", err);
      setMessage({ type: "danger", text: err.message });
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setCondition(item.condition);
    setDescription(item.description);
    setLocation(item.location); // Ensure location is also set for editing
    // Note: Images and videos are not set in the form, but you can handle that if needed
  };

  const handleDeleteClick = (postId) => {
    setDeletingItem(postId);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await fetch(`${API_BASE}/delete/${deletingItem}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete item");
      }

      setMessage({ type: "success", text: "Item deleted successfully!" });
      fetchItems();
    } catch (err) {
      console.error("❌ Delete error:", err);
      setMessage({ type: "danger", text: err.message });
    }
    setDeletingItem(null); // Close the confirmation modal
  };

  const cancelDelete = () => {
    setDeletingItem(null); // Close the confirmation modal without deleting
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Post a Trade Item</h2>

          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Item Name */}
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

            {/* Category */}
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
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

            {/* Location */}
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

            {/* Condition */}
            <Form.Group className="mb-3">
              <Form.Label>Condition</Form.Label>
              <Form.Select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
              </Form.Select>
            </Form.Group>

            {/* Description */}
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

            {/* Upload Image */}
            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Form.Group>

            {/* Upload Video (Optional) */}
            <Form.Group className="mb-3">
              <Form.Label>Upload Video (Optional)</Form.Label>
              <Form.Control
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              {editingItem ? "Update Item" : "Post Item"}
            </Button>
          </Form>
        </Col>
      </Row>

      {/* Display Posted Items */}
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
              {!item.imageUrl && item.videoUrl && (
                <video
                  controls
                  style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
                >
                  <source
                    src={`http://localhost:3000${item.videoUrl}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              )}
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Card.Text>
                  <strong>Category:</strong> {item.category} <br />
                  <strong>Condition:</strong> {item.condition} <br />
                  <strong>Location:</strong> {item.location} {/* Added location display */}
                </Card.Text>
                {/* Edit and Delete buttons */}
                <Button variant="secondary" onClick={() => handleEditClick(item)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDeleteClick(item._id)}>Delete</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>


      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="modal">
          <div className="modal-content">
            <h5>Are you sure you want to delete this post?</h5>
            <Button variant="danger" onClick={confirmDelete}>
              Yes, Delete
            </Button>
            <Button variant="secondary" onClick={cancelDelete}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}

export default PostItem;
